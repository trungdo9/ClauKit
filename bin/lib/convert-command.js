/**
 * `ck convert` command — prints a summary in the same style as `ck init`.
 */

const { runConvert, TARGETS } = require("./convert");

function convertCommand(options, target) {
  const projectRoot = process.cwd();

  if (!target || target === "list") {
    console.log(`Available convert targets: ${Object.keys(TARGETS).join(", ")}`);
    return;
  }

  console.log(`🔄 Converting .claude/ → ${target}`);
  console.log(`📂 Project: ${projectRoot}\n`);

  let summary;
  try {
    summary = runConvert(target, projectRoot, options);
  } catch (err) {
    console.error(`❌ ${err.message}`);
    process.exitCode = 1;
    return;
  }

  for (const f of summary.written) console.log(`   ✅ ${f}`);
  for (const f of summary.skipped) console.log(`   ⚠️  SKIP (exists): ${f}`);

  console.log(`\n✅ Converted for ${target} — ${summary.written.length} written · ${summary.skipped.length} skipped`);
  if (summary.skipped.length && !options.force) {
    console.log(`   💡 Use --force to overwrite previously converted files.`);
  }
  if (summary.warnings.length) {
    console.log(`\n⚠️  Not portable — review by hand:`);
    for (const w of summary.warnings) console.log(`   - ${w}`);
  }
}

module.exports = { convertCommand };
