/**
 * Kit resolution and listing.
 *
 * Reads manifests from .claude/kits/*.json and resolves a kit name
 * (or custom manifest path) into a usable manifest object.
 */

const fs = require("fs");
const path = require("path");

const KITS_DIR = path.join(__dirname, "..", "..", ".claude", "kits");
const PACKAGE_ROOT = path.join(__dirname, "..", "..");

/**
 * List available kits from .claude/kits/*.json
 * Returns array of { file, manifest } or empty if no kits dir.
 */
function listKits() {
  if (!fs.existsSync(KITS_DIR)) return [];
  return fs.readdirSync(KITS_DIR)
    .filter(f => f.endsWith(".json"))
    .map(f => {
      try {
        const manifest = JSON.parse(fs.readFileSync(path.join(KITS_DIR, f), "utf8"));
        return { file: f, manifest };
      } catch (e) {
        console.warn(`⚠️  Skipping malformed kit ${f}: ${e.message}`);
        return null;
      }
    })
    .filter(Boolean);
}

/**
 * Resolve a kit name to its manifest.
 * Accepts: 'engineer' (default) | named kit | path to custom JSON.
 * Returns: { name, manifest, source } | null
 * Exits process with error if kit not found.
 */
function resolveKit(kitArg) {
  if (!kitArg || kitArg === "engineer") {
    const engineer = listKits().find(k => k.manifest.name === "engineer");
    if (!engineer) {
      console.error("❌ Default 'engineer' kit not found in .claude/kits/");
      process.exit(1);
    }
    return { name: "engineer", manifest: engineer.manifest, source: engineer.file };
  }

  // Custom JSON file (relative or absolute)
  if (kitArg.endsWith(".json")) {
    const customPath = path.isAbsolute(kitArg) ? kitArg : path.join(process.cwd(), kitArg);
    if (!fs.existsSync(customPath)) {
      console.error(`❌ Custom manifest not found: ${customPath}`);
      process.exit(1);
    }
    try {
      const manifest = JSON.parse(fs.readFileSync(customPath, "utf8"));
      if (!manifest.name || !manifest.paths) {
        console.error("❌ Custom manifest missing required 'name' or 'paths'");
        process.exit(1);
      }
      return { name: manifest.name, manifest, source: customPath };
    } catch (e) {
      console.error(`❌ Failed to parse custom manifest: ${e.message}`);
      process.exit(1);
    }
  }

  // Named kit
  const found = listKits().find(k => k.manifest.name === kitArg);
  if (!found) {
    const available = listKits().map(k => k.manifest.name).join(", ");
    console.error(`❌ Unknown kit: '${kitArg}'`);
    console.error(`   Available kits: ${available || "(none)"}`);
    process.exit(1);
  }
  return { name: found.manifest.name, manifest: found.manifest, source: found.file };
}

/**
 * Collect all install paths from a kit manifest (paths.* + requires.*, deduped).
 * Accepts either a raw manifest or a resolved kit { name, manifest, source }.
 */
function getKitPaths(kitOrManifest) {
  const manifest = kitOrManifest && kitOrManifest.manifest ? kitOrManifest.manifest : kitOrManifest;
  const paths = [];
  for (const arr of Object.values(manifest.paths || {})) {
    if (Array.isArray(arr)) paths.push(...arr);
  }
  for (const arr of Object.values(manifest.requires || {})) {
    if (Array.isArray(arr)) paths.push(...arr);
  }
  return [...new Set(paths)];
}

/**
 * Resolve a manifest-declared relPath to its REAL location inside the package.
 *
 * Manifests reference `.claude/skills/...`, but in the dev repo `.claude/skills`
 * is a symlink → `../skills`. npm does NOT publish symlinks (nor their targets
 * under the symlinked path), so on an installed package `.claude/skills/...`
 * does not exist while the real files live under `skills/...`. Fall back to the
 * de-symlinked location so install works from a published tarball.
 *
 * Returns an absolute path that exists, or the original `.claude/...` absolute
 * path (non-existent) when no fallback applies — caller still detects "missing".
 */
function resolveSourcePath(relPath) {
  const primary = path.join(PACKAGE_ROOT, relPath);
  if (fs.existsSync(primary)) return primary;
  // Strip a leading `.claude/` and retry at package root (covers the
  // `.claude/skills → ../skills` symlink that npm drops on publish).
  const stripped = relPath.replace(/^\.claude[\\/]/, "");
  const fallback = path.join(PACKAGE_ROOT, stripped);
  if (stripped !== relPath && fs.existsSync(fallback)) return fallback;
  return primary;
}

/**
 * Verify all kit paths exist in the package. Returns array of missing paths.
 */
function checkKitPathsAvailable(kitOrManifest) {
  return getKitPaths(kitOrManifest).filter(p => !fs.existsSync(resolveSourcePath(p)));
}

/**
 * Print a formatted kit list to stdout.
 */
function printKitList() {
  const kits = listKits();
  if (kits.length === 0) {
    console.log("⚠️  No kits found in .claude/kits/");
    return;
  }
  console.log(`📦 Available kits (${kits.length}):\n`);
  for (const k of kits) {
    const v = (k.manifest.version || "?").padEnd(8);
    console.log(`  ${k.manifest.name.padEnd(12)} v${v} ${k.manifest.description || ""}`);
  }
  console.log(`\nUsage: ck init --kit <name>`);
}

module.exports = {
  PACKAGE_ROOT,
  listKits,
  resolveKit,
  getKitPaths,
  resolveSourcePath,
  checkKitPathsAvailable,
  printKitList
};
