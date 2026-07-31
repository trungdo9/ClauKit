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

  let copied = 0, skipped = 0;
  for (const relPath of getKitPaths(kit)) {
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

  // An existing settings.json is skipped by the copy loop, which used to leave
  // newly-installed hooks wired to nothing. Merge the missing entries in
  // additively rather than making the user choose between --force (which
  // replaces their permissions and env) and a silently inert install.
  const settingsRel = ".claude/settings.json";
  const projectSettings = path.join(projectRoot, settingsRel);
  if (fs.existsSync(projectSettings)) {
    const added = mergeSettings(resolveSourcePath(settingsRel), projectSettings);
    if (added.length) {
      console.log(`\n   🔗 wired into your existing ${settingsRel}:`);
      for (const a of added) console.log(`      + ${a}`);
    }
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
