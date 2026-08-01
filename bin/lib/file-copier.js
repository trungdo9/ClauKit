/**
 * File and directory copying with symlink dereferencing.
 *
 * Ensures `ck init` consumers get real skills/files even when the dev
 * repo uses symlinks (e.g., .claude/skills → ../skills).
 */

const fs = require("fs");
const path = require("path");

const PACKAGE_ROOT = path.join(__dirname, "..", "..");

/**
 * Recursive copy. Dereferences symlinked dirs → real files.
 * Skips broken symlinks with a warning.
 */
function copyDirectory(source, target) {
  const files = fs.readdirSync(source);
  files.forEach(file => {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);
    const lstat = fs.lstatSync(sourcePath);

    if (lstat.isSymbolicLink()) {
      let real;
      try {
        real = fs.realpathSync(sourcePath);
      } catch (e) {
        console.warn(`   ⚠️  Skipping broken symlink: ${path.relative(PACKAGE_ROOT, sourcePath)}`);
        return;
      }
      const realStat = fs.statSync(real);
      if (realStat.isDirectory()) {
        if (!fs.existsSync(targetPath)) fs.mkdirSync(targetPath, { recursive: true });
        copyDirectory(real, targetPath);
      } else {
        fs.copyFileSync(real, targetPath);
      }
      return;
    }

    if (lstat.isDirectory()) {
      if (!fs.existsSync(targetPath)) fs.mkdirSync(targetPath, { recursive: true });
      copyDirectory(sourcePath, targetPath);
    } else {
      try {
        copyFileSafe(sourcePath, targetPath);
      } catch (e) {
        if (e.code === "ENOENT") {
          console.warn(`   ⚠️  Skipping missing file: ${path.relative(PACKAGE_ROOT, sourcePath)}`);
        } else {
          throw e;
        }
      }
    }
  });
}

/**
 * Stream-based file copy. More reliable than fs.copyFileSync on Windows
 * for paths with `\.` segments (which can trigger ENOENT in copyFileSync).
 */
function streamCopy(src, dst) {
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  return new Promise((resolve, reject) => {
    const r = fs.createReadStream(src);
    const w = fs.createWriteStream(dst);
    r.on("error", reject);
    w.on("error", reject);
    w.on("close", resolve);
    r.pipe(w);
  });
}

/**
 * Synchronous stream copy using fs.readFileSync/writeFileSync fallback.
 * Used in places where we need sync (e.g., copyPath entry point).
 */
function copyFileSafe(src, dst) {
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  const buf = fs.readFileSync(src);
  fs.writeFileSync(dst, buf);
}

/** Files under dst that the kit does not ship — i.e. the user's own. */
function filesNotShipped(src, dst) {
  const walk = (dir, base = "") => {
    let out = [];
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return out;
    }
    for (const e of entries) {
      const rel = base ? `${base}/${e.name}` : e.name;
      if (e.isDirectory()) out = out.concat(walk(path.join(dir, e.name), rel));
      else out.push(rel);
    }
    return out;
  };
  const shipped = new Set(walk(src));
  return walk(dst).filter((f) => !shipped.has(f));
}

/**
 * Copy a single path (file or directory).
 * Returns: "copied" | "skipped" | "warned"
 *   - copied: freshly written
 *   - skipped: target already exists and !force
 *   - warned: same as skipped (reserved for future explicit warn state)
 */
function copyPath(src, dst, options = {}) {
  if (!fs.existsSync(src)) return "skipped";

  // Label by destination (what the user gets), not source — source may be a
  // de-symlinked location (skills/) while dest keeps the .claude/ layout.
  const relDst = path.relative(process.cwd(), dst);

  const stat = fs.lstatSync(src);

  if (fs.existsSync(dst)) {
    if (!options.force) {
      console.log(`   ⚠️  SKIP (exists): ${relDst}`);
      return "skipped";
    }
    // --force used to `rmSync(dst, {recursive:true})`. Once a kit shipped a
    // destination OUTSIDE .claude/ (scripts/ck/), that recursively deleted a
    // top-level user directory — a project's own scripts/ck/deploy.js vanished
    // with no warning. Overwrite what we ship; never delete what we don't.
    if (stat.isDirectory()) {
      const foreign = filesNotShipped(src, dst);
      copyDirectory(src, dst);
      console.log(`   ✅ ${relDst} (overwritten)${foreign.length ? ` · kept ${foreign.length} file(s) you own` : ""}`);
      return "copied";
    }
    console.log(`   ⚠️  OVERWRITING: ${relDst}`);
  }

  if (stat.isDirectory()) {
    copyDirectory(src, dst);
  } else {
    copyFileSafe(src, dst);
  }
  console.log(`   ✅ ${relDst}`);
  return "copied";
}

/**
 * Print file tree of a directory.
 */
function listFiles(dir, prefix = "") {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    const icon = stat.isDirectory() ? "📁" : "📄";
    console.log(`${prefix}${icon} ${file}`);
    if (stat.isDirectory()) listFiles(filePath, prefix + "  ");
  });
}

module.exports = { copyDirectory, copyPath, listFiles, streamCopy, copyFileSafe };
