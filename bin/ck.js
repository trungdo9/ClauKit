#!/usr/bin/env node

/**
 * ClauKit CLI - Initialize Claude configuration in your project.
 *
 * Usage:
 *   ck init [--kit <name>] [--force]
 *   ck update
 *   ck help
 *
 * See bin/lib/ for command implementations (kit-resolver, file-copier,
 * metadata-writer, github-client, cli-parser).
 */

const fs = require("fs");
const path = require("path");
const packageJson = require("../package.json");

const { resolveKit, getKitPaths, resolveSourcePath, checkKitPathsAvailable, printKitList } = require("./lib/kit-resolver");
const { copyPath } = require("./lib/file-copier");
const { writeMetadata } = require("./lib/metadata-writer");
const { mergeSettings } = require("./lib/settings-merge");
const { migrateCjs } = require("./lib/cjs-migrate");
const { migrateDocRefs } = require("./lib/cjs-migrate-refs");
const { wireClaudeMd } = require("./lib/claude-md-wire");
const { wireGitignore } = require("./lib/gitignore-wire");
const { fetchLatestVersion, compareVersions } = require("./lib/github-client");
const { parseArgs, showHelp } = require("./lib/cli-parser");

const args = process.argv.slice(2);

/**
 * Initialize Claude configuration for the chosen kit.
 */
function initCommand(options = {}) {
  const projectRoot = process.cwd();
  const kit = resolveKit(options.kit);

  console.log(`🚀 ClauKit v${packageJson.version}`);
  console.log(`📂 Project: ${projectRoot}`);
  console.log(`📦 Kit: ${kit.name} (${kit.manifest.version || "?"})`);
  console.log(`📝 ${kit.manifest.description || ""}\n`);

  // Pre-flight: all kit paths must exist in the package
  const missing = checkKitPathsAvailable(kit);
  if (missing.length > 0) {
    console.error(`❌ Kit '${kit.name}' references ${missing.length} missing path(s) in package:`);
    for (const m of missing.slice(0, 10)) console.error(`   - ${m}`);
    if (missing.length > 10) console.error(`   ... and ${missing.length - 10} more`);
    process.exit(1);
  }

  const settingsRel = ".claude/settings.json";
  const projectSettings = path.join(projectRoot, settingsRel);
  // The merge below is the ONLY writer of an existing settings.json, `--force`
  // included. Letting the copy loop overwrite it first and then merging into the
  // result defeated the merge entirely: the permissions and env the merge exists
  // to protect were already gone by the time it ran, so `--force` — which users
  // need for every other directory to refresh — silently ate them.
  const ownedByMerge = fs.existsSync(projectSettings) ? new Set([settingsRel]) : new Set();

  let copied = 0, skipped = 0;
  for (const relPath of getKitPaths(kit)) {
    if (ownedByMerge.has(relPath)) { skipped++; continue; }
    // Source may resolve to a de-symlinked location (e.g. skills/ instead of
    // .claude/skills/) on a published tarball; destination keeps the manifest
    // path so the project gets the expected .claude/ layout.
    const result = copyPath(
      resolveSourcePath(relPath),
      path.join(projectRoot, relPath),
      options
    );
    if (result === "copied") copied++;
    else if (result === "skipped") skipped++;
  }

  // ClauKit's CommonJS files used to ship as `.js`, which Node parses as ESM in
  // any project with `"type": "module"` — every hook crashed on `require`, and
  // the two PreToolUse guards failed open. They ship as `.cjs` now; this repairs
  // the installs that predate the rename. Before mergeSettings, so the merge
  // sees the rewritten entries rather than adding a second copy of each.
  const migrated = migrateCjs(projectRoot, resolveSourcePath);
  // Unconditional, not gated on `migrated.removed`: the files and the docs that
  // invoke them are fixed by different runs when a partial upgrade happened, and
  // a doc left pointing at a deleted path is the quiet half of this bug. Reading
  // ~600 shipped .md/.sh files costs less than the copy loop already spent, and
  // the sweep only writes when a shipped path actually changed.
  const staleDocs = migrateDocRefs(projectRoot);
  if (migrated.restored.length || migrated.rewritten.length || migrated.removed.length || staleDocs.length) {
    console.log(`\n   🔧 migrated ClauKit's CommonJS files to .cjs (they broke under "type": "module"):`);
    for (const f of migrated.restored) console.log(`      + installed ${f}`);
    for (const f of migrated.rewritten) console.log(`      ~ repointed ${f} → .cjs in ${settingsRel}`);
    for (const f of migrated.removed) console.log(`      - removed stale ${f}`);
    if (staleDocs.length) console.log(`      ~ updated ${staleDocs.length} shipped doc(s) that invoked the old paths`);
  }

  if (fs.existsSync(projectSettings)) {
    const added = mergeSettings(resolveSourcePath(settingsRel), projectSettings);
    if (added.length) {
      console.log(`\n   🔗 wired into your existing ${settingsRel}:`);
      for (const a of added) console.log(`      + ${a}`);
    }
  }

  // Workflows are copied above, but Claude Code only auto-reads CLAUDE.md —
  // without a pointer there, every gate in .claude/workflows/ is a file nobody
  // opens. Same class of silent breakage as the settings.json merge above.
  const wired = wireClaudeMd(projectRoot, kit);
  if (wired.action === "created") {
    console.log(`\n   📄 CLAUDE.md created — ${wired.count} workflow(s) wired in.`);
    console.log(`      Run /ck:claude-md init to expand it with your project's specifics.`);
  } else if (wired.action === "wired") {
    console.log(`\n   🔗 wired ${wired.count} workflow(s) into your existing CLAUDE.md (§Workflows appended).`);
  }

  // `.claude/.gitignore` cannot be shipped as a file — npm strips every
  // .gitignore from every tarball — so the rules are merged in from data.
  const ignored = wireGitignore(projectRoot);
  if (ignored.action === "created") {
    console.log(`\n   📄 .claude/.gitignore created — ${ignored.added.length} runtime-state path(s) ignored.`);
  } else if (ignored.action === "wired") {
    console.log(`\n   🔗 added ${ignored.added.length} rule(s) to your existing .claude/.gitignore:`);
    for (const a of ignored.added) console.log(`      + ${a}`);
  }

  writeMetadata(projectRoot, packageJson, kit);

  console.log(`\n✅ Kit '${kit.name}' installed!`);
  console.log(`   ${copied} paths copied · ${skipped} skipped`);
  if (skipped > 0 && !options.force) {
    console.log(`\n   💡 Use --force to overwrite existing files (your own files in those directories are kept).`);
  }
}

/**
 * `ck update` — show latest version from GitHub.
 */
async function updateCommand() {
  console.log(`🚀 ClauKit Updater v${packageJson.version}\n`);

  try {
    const repo = packageJson.repository?.url?.replace("https://github.com/", "").replace(".git", "") || "trungdo9/ClauKit";
    const latestVersion = await fetchLatestVersion(repo);
    if (!latestVersion) {
      console.log("⚠️  Could not find latest version on GitHub");
      console.log("   Please check your internet connection");
      return;
    }
    console.log(`📦 Latest version: ${latestVersion}`);
    console.log(`📦 Current version: ${packageJson.version}`);

    const cmp = compareVersions(packageJson.version, latestVersion);
    if (cmp === 0) {
      console.log("\n✅ You are running the latest version!");
    } else if (cmp < 0) {
      console.log("\n🆕 A new version is available!");
      console.log(`\n   npm install -g ${packageJson.name}@latest`);
      console.log(`   npx ${packageJson.name}@latest <command>`);
    } else {
      console.log("\n⚠️  You are running a newer version than released.");
      console.log("   This is a development version.");
    }
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
  }
}

// Main
const { options, commandArgs } = parseArgs(args);
const cmd = commandArgs[0] || "help";

switch (cmd) {
  case "init":
    if (options.kit === "list") printKitList();
    else initCommand(options);
    break;
  case "update":
    updateCommand();
    break;
  case "help":
  default:
    showHelp(packageJson);
}
