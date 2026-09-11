/**
 * spine-deliver.cjs — deliver the six template-driven deliverables (D-13: scope,
 * uat, acceptance, release-notes, golive, handover) from the entity index.
 * A deterministic script, not an LLM re-render (ruling R7).
 *
 * `deliver(projectDir, what, { force }) => { ok, files?, skipped?, violations? }`
 * Validates first: violations ⇒ { ok: false, violations }, nothing written.
 * Clean ⇒ renders and writes under <projectDir>/deliverables/, returning
 * { ok: true, files, skipped }.
 *
 * Class table (D-11): `derived` = regenerable byte-stably, overwritten freely.
 * `owned` = seeded once, human-owned, generator refuses to overwrite without --force.
 * Both classes committed.
 *
 * Byte-stable by construction: no `Date.now()`/`new Date()` in this file.
 */

const fs = require('fs');
const path = require('path');
const { buildIndex, findGaps, validate, changelog } = require('./spine-index.cjs');
const templates = require('./deliver-templates.cjs');

const DELIVERABLES = {
  scope: { file: 'SCOPE-001.md', class: 'derived' },
  uat: { file: 'UAT-001.md', class: 'owned' },
  acceptance: { file: 'ACCEPTANCE-001.md', class: 'owned' },
  'release-notes': { file: 'RELEASE-NOTES-001.md', class: 'derived' },
  golive: { file: 'GOLIVE-001.md', class: 'owned' },
  handover: { file: 'HANDOVER-001.md', class: 'owned' },
};

const SIGN_BLOCK = `## Ký xác nhận

| Vai trò | Họ tên | Chữ ký | Ngày |
|---|---|---|---|
| BA | [TO FILL] | [TO FILL] | [TO FILL] |
| Chủ sản phẩm (PO) — phía khách hàng | [TO FILL] | [TO FILL] | [TO FILL] |`;

/**
 * `deliver(projectDir, what, { force } = {})` — the main entry point.
 * Returns { ok, files?, skipped?, violations? }. Throws only on I/O errors; the CLI maps those to exit 2.
 */
function deliver(projectDir, what, { force = false } = {}) {
  const { index, errors } = buildIndex(projectDir);
  const violations = validate(index, errors);
  if (violations.length) {
    return { ok: false, violations };
  }

  const outDir = path.join(projectDir, 'deliverables');
  fs.mkdirSync(outDir, { recursive: true });

  if (what === 'all') {
    const files = [];
    const skipped = [];
    const order = ['scope', 'release-notes', 'uat', 'acceptance', 'golive', 'handover'];
    for (const a of order) {
      const spec = DELIVERABLES[a];
      const outPath = path.join(outDir, spec.file);
      if (spec.class === 'owned' && fs.existsSync(outPath) && !force) {
        skipped.push(outPath);
      } else {
        const render = templates[a];
        if (render) {
          const ctx = { projectDir, index, gaps: findGaps(index), crs: changelog(index), SIGN_BLOCK };
          const text = render(ctx);
          fs.writeFileSync(outPath, text);
          files.push(outPath);
        }
      }
    }
    warnIfIgnored(files, projectDir);
    return { ok: skipped.length === 0, files, skipped };
  }

  if (!DELIVERABLES[what]) {
    // Unreachable from the CLI (it validates `what` first, exit 2); a structured answer for direct callers.
    return { ok: false, violations: [{ file: '', id: '', check: 'unknown-deliverable', msg: `unknown deliverable '${what}' — one of ${Object.keys(DELIVERABLES).join('|')}|all` }] };
  }

  const spec = DELIVERABLES[what];
  const outPath = path.join(outDir, spec.file);

  // Never-overwrite rule for owned deliverables
  if (spec.class === 'owned' && fs.existsSync(outPath) && !force) {
    return { ok: false, skipped: [outPath] };
  }

  // Render and write
  const render = templates[what];
  if (!render) {
    // Unreachable from the CLI (it validates `what` first, exit 2); a structured answer for direct callers.
    return { ok: false, violations: [{ file: '', id: '', check: 'unknown-deliverable', msg: `unknown deliverable '${what}' — one of ${Object.keys(DELIVERABLES).join('|')}|all` }] };
  }

  const ctx = { projectDir, index, gaps: findGaps(index), crs: changelog(index), SIGN_BLOCK };
  const text = render(ctx);
  fs.writeFileSync(outPath, text);
  warnIfIgnored([outPath], projectDir);

  return { ok: true, files: [outPath] };
}

/**
 * One stderr line per ignored deliverable (verify-plan R-VP3). A consumer project's `plans/` is
 * not ignored — `ck init` writes only PLAN_RULES (derived index, regenerable reports) — so this
 * fires only where a project's own .gitignore excludes `plans/`.
 * One spawn per run, not per file: without `-q`, `git check-ignore` prints every ignored path it was given.
 * Absolute paths, because the previous call passed cwd-relative paths with `cwd: projectDir`, so a
 * relative <project-dir> would make git look for plans/ba/<p>/plans/ba/<p>/… and the warning could never fire.
 */
function warnIfIgnored(outPaths, projectDir) {
  if (!outPaths.length) return;
  // One spawn per run, not per file: without `-q`, `git check-ignore` prints every ignored path it was given.
  // Absolute paths, because the previous call passed cwd-relative paths with `cwd: projectDir`, so a relative
  // <project-dir> made git look for plans/ba/<p>/plans/ba/<p>/… and the warning could never fire.
  const root = path.resolve(projectDir);
  const abs = outPaths.map((p) => path.resolve(p));
  const r = require('child_process').spawnSync('git', ['check-ignore', ...abs], { cwd: root, encoding: 'utf8' });
  for (const p of String(r.stdout || '').split('\n').filter(Boolean)) {
    console.warn(`⚠ ${p} is git-ignored in this project — add \`!plans/**/deliverables/*.md\` to .gitignore or the signed document will not be committed (D-11)`);
  }
}

module.exports = { deliver, DELIVERABLES, SIGN_BLOCK };
