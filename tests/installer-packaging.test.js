/**
 * Packaging tests — what survives `npm pack`, as opposed to what works when run
 * from this repo.
 *
 * These exist because `installer.test.js` asserted the right behaviour through a
 * path that could not fail. It ran `bin/ck.js` from the repo, where
 * `.claude/.gitignore` is present on disk, so the copy loop found it and
 * `git check-ignore` passed. npm strips every `.gitignore` from every tarball —
 * a packing rule, not a misconfiguration — so on a real install the
 * manifest-declared path did not exist, `checkKitPathsAvailable()` reported it
 * missing, and `ck init` exited 1 before copying anything, for all three kits.
 *
 * Same blindness as the CLAUDE.md defect one release earlier: the repo's own
 * layout hid a defect every consumer would hit. So the last test here asserts
 * the general rule rather than this one instance — every kit-declared path must
 * be present in the tarball.
 */

const { test, before, after } = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { RULES, PLAN_RULES, existingPatterns } = require('../bin/lib/gitignore-wire');

const REPO = path.join(__dirname, '..');
const CK = path.join(REPO, 'bin', 'ck.js');

let work;

function init(dir, extra = []) {
  return spawnSync('node', [CK, 'init', '--kit', 'engineer', ...extra], { cwd: dir, encoding: 'utf-8' });
}

function fresh() {
  const d = fs.mkdtempSync(path.join(work, 'p-'));
  spawnSync('git', ['init', '-q', '.'], { cwd: d });
  return d;
}

before(() => { work = fs.mkdtempSync(path.join(os.tmpdir(), 'ck-pack-')); });
after(() => fs.rmSync(work, { recursive: true, force: true }));

test('.claude/.gitignore is created from data, not copied as a file', () => {
  const p = fresh();
  const res = init(p);
  assert.strictEqual(res.status, 0, res.stderr);
  const f = path.join(p, '.claude/.gitignore');
  assert.ok(fs.existsSync(f), 'a fresh install must produce it even though npm cannot ship it');
  const text = fs.readFileSync(f, 'utf-8');
  for (const rule of RULES) assert.match(text, new RegExp(`^${rule.replace(/\./g, '\\.')}$`, 'm'));
});

test('an existing .claude/.gitignore keeps the user\'s lines and gains only what is missing', () => {
  const p = fresh();
  fs.mkdirSync(path.join(p, '.claude'), { recursive: true });
  fs.writeFileSync(path.join(p, '.claude/.gitignore'), '# mine\nscratch/\n.ck-tail-approved\n');
  const res = init(p);
  assert.strictEqual(res.status, 0, res.stderr);
  const text = fs.readFileSync(path.join(p, '.claude/.gitignore'), 'utf-8');
  assert.match(text, /^scratch\/$/m, 'the user\'s own rule survives');
  assert.match(text, /^# mine$/m, 'their comment survives');
  assert.strictEqual(text.match(/^\.ck-tail-approved$/gm).length, 1, 'a rule they already had is not duplicated');
  assert.match(text, /^\.ck-file-claims\.jsonl$/m, 'a rule they lacked is appended');
});

test('regenerable plan artifacts are ignored in the project ROOT .gitignore', () => {
  // run-workspace.cjs calls plans/<plan>/reports/ "a git-ignored per-plan
  // artifact dir" and nothing ClauKit installed ignored it: every
  // review-package run writes a full `git diff -U10` there, every phase-brief
  // writes another timestamped file, and `git add -A` swept the lot into history.
  const p = fresh();
  const res = init(p);
  assert.strictEqual(res.status, 0, res.stderr);
  const text = fs.readFileSync(path.join(p, '.gitignore'), 'utf-8');
  for (const rule of PLAN_RULES) assert.ok(existingPatterns(text).has(rule), `missing: ${rule}`);
  // The rules must land at the ROOT: a `plans/` pattern inside .claude/ would
  // only ever match `.claude/plans/`, which does not exist.
  assert.ok(!existingPatterns(fs.readFileSync(path.join(p, '.claude/.gitignore'), 'utf-8')).has(PLAN_RULES[0]));
});

test('plan-artifact rules leave a hand-written report committable', () => {
  // Ignoring plans/** or all of reports/ would be the easy fix and the wrong
  // one: reports are linked from the PR body, so an ignored one is a 404.
  const p = fresh();
  init(p);
  const dir = path.join(p, 'plans', '260810-1200-x', 'reports');
  fs.mkdirSync(dir, { recursive: true });
  for (const f of ['plan.md', 'STATE.md']) fs.writeFileSync(path.join(p, 'plans', '260810-1200-x', f), 'x\n');
  for (const f of ['code-review.md', 'review-package-abc123.md', 'phase-2-brief-1754800000.md']) {
    fs.writeFileSync(path.join(dir, f), 'x\n');
  }
  const ignored = (rel) =>
    spawnSync('git', ['check-ignore', '-q', rel], { cwd: p }).status === 0;
  assert.ok(ignored('plans/260810-1200-x/reports/review-package-abc123.md'), 'regenerated diff must be ignored');
  assert.ok(ignored('plans/260810-1200-x/reports/phase-2-brief-1754800000.md'), 'regenerated brief must be ignored');
  assert.ok(!ignored('plans/260810-1200-x/reports/code-review.md'), 'a hand-written report must stay committable');
  assert.ok(!ignored('plans/260810-1200-x/plan.md'), 'the plan itself must stay committable');
  assert.ok(!ignored('plans/260810-1200-x/STATE.md'), 'the run ledger must stay committable');
});

test('an existing root .gitignore keeps its lines and gains only what is missing', () => {
  const p = fresh();
  fs.writeFileSync(path.join(p, '.gitignore'), '# mine\nnode_modules\nplans/**/reports/*-brief-*.md\n');
  assert.strictEqual(init(p).status, 0);
  const text = fs.readFileSync(path.join(p, '.gitignore'), 'utf-8');
  assert.match(text, /^node_modules$/m, "the user's own rule survives");
  assert.match(text, /^# mine$/m, 'their comment survives');
  assert.strictEqual(text.match(/^plans\/\*\*\/reports\/\*-brief-\*\.md$/gm).length, 1, 'not duplicated');
  assert.ok(existingPatterns(text).has('plans/**/reports/review-package-*.md'), 'the missing one is appended');
});

test('.gitignore wiring is idempotent — a second init adds nothing', () => {
  const p = fresh();
  init(p);
  const first = fs.readFileSync(path.join(p, '.claude/.gitignore'), 'utf-8');
  const res = init(p);
  assert.strictEqual(fs.readFileSync(path.join(p, '.claude/.gitignore'), 'utf-8'), first);
  assert.ok(!/added \d+ rule/.test(res.stdout), 'nothing left to add');
});

test('an equivalent pattern written with a leading slash is not re-added', () => {
  const p = fresh();
  fs.mkdirSync(path.join(p, '.claude'), { recursive: true });
  fs.writeFileSync(path.join(p, '.claude/.gitignore'), RULES.map((r) => `/${r}`).join('\n') + '\n');
  init(p);
  const text = fs.readFileSync(path.join(p, '.claude/.gitignore'), 'utf-8');
  for (const rule of RULES) {
    const hits = (text.match(new RegExp(`^/?${rule.replace(/\./g, '\\.')}$`, 'gm')) || []).length;
    assert.strictEqual(hits, 1, `${rule} must not be appended alongside its /-prefixed twin`);
  }
});

test('the wired rules stay in sync with ClauKit\'s own .claude/.gitignore', () => {
  const own = fs.readFileSync(path.join(REPO, '.claude/.gitignore'), 'utf-8');
  const declared = existingPatterns(own);
  for (const rule of RULES) {
    assert.ok(declared.has(rule), `${rule} is wired into consumers but missing from this repo's own .claude/.gitignore — the two must not drift`);
  }
});

test('the plan-artifact rules stay in sync with ClauKit\'s own root .gitignore', () => {
  // Same anti-drift rule as above, for the other scope: this repo discovered the
  // need for these two patterns first and wired them into consumers second.
  const declared = existingPatterns(fs.readFileSync(path.join(REPO, '.gitignore'), 'utf-8'));
  for (const rule of PLAN_RULES) {
    assert.ok(declared.has(rule), `${rule} is wired into consumers but missing from this repo's own .gitignore`);
  }
});

test('every kit-declared path survives npm pack', () => {
  const res = spawnSync('npm', ['pack', '--dry-run', '--json'], { cwd: REPO, encoding: 'utf-8', maxBuffer: 32 * 1024 * 1024 });
  assert.strictEqual(res.status, 0, res.stderr);
  const packed = JSON.parse(res.stdout)[0].files.map((f) => f.path);
  // A declared path is satisfied when the tarball carries it, or carries its
  // de-symlinked twin (`.claude/skills/x` ships as `skills/x` — npm drops the
  // .claude/skills symlink), matching resolveSourcePath()'s fallback.
  const satisfied = (p) => {
    const stripped = p.replace(/^\.claude[\\/]/, '');
    return packed.some((f) => f === p || f.startsWith(p.replace(/\/?$/, '/'))
      || f === stripped || f.startsWith(stripped.replace(/\/?$/, '/')));
  };
  for (const name of ['engineer', 'marketing', 'both']) {
    const manifest = JSON.parse(fs.readFileSync(path.join(REPO, `.claude/kits/${name}.json`), 'utf-8'));
    const declared = [
      ...Object.values(manifest.paths || {}).flat(),
      ...Object.values(manifest.requires || {}).flat(),
    ];
    const missing = declared.filter((p) => !satisfied(p));
    assert.deepStrictEqual(missing, [], `kit '${name}' declares path(s) npm will not ship — ck init exits 1 on a real install`);
  }
});

// Every path ClauKit deletes from a user's project is deleted on the strength of
// a content digest. `cjs-migrate`'s SHIPPED_JS table is resolved against git by
// esm-host.test.js; the two tables in `retired-files.js` were not checked at all,
// which is the same proof held to two standards. A typo in one of these silently
// stops a path being cleaned up (RETIRED) or a stale doc being refreshed (STALE),
// and nothing fails — the installer just quietly does less than it reports.
test('every retirement digest resolves to a real blob in this repo', () => {
  const { RETIRED, STALE } = require('../bin/lib/retired-files');
  const entries = [
    ...RETIRED.map((r) => ['RETIRED', r]),
    ...STALE.map((r) => ['STALE', r]),
  ];
  assert.ok(entries.length > 0, 'the tables must not be empty');

  for (const [table, entry] of entries) {
    assert.ok(Array.isArray(entry.sha) && entry.sha.length > 0,
      `${table} ${entry.path} has no digests — it would never match, so it is dead config`);
    for (const sha of entry.sha) {
      assert.match(sha, /^[0-9a-f]{40}$/, `${table} ${entry.path}: ${sha} is not a blob id`);
      const t = spawnSync('git', ['cat-file', '-t', sha], { cwd: REPO, encoding: 'utf-8' });
      assert.strictEqual(t.stdout.trim(), 'blob',
        `${table} ${entry.path}: ${sha} is not a blob in this repo — a digest nobody can regenerate is not proof`);
    }
  }
});

test('a retired path is not still named by the prose that ships beside it', () => {
  // The coherence gate keeps a retired file while any shipped doc still invokes
  // it. If ClauKit's OWN tree still names one, every install hits that gate and
  // the retirement never completes — the cleanup silently does nothing forever.
  const { RETIRED } = require('../bin/lib/retired-files');
  for (const entry of RETIRED) {
    const hits = spawnSync('grep', ['-rl', '--include=*.md', '--include=*.sh', entry.token, '.claude'],
      { cwd: REPO, encoding: 'utf-8' }).stdout.split('\n').filter(Boolean)
      .filter((f) => f !== entry.path.replace(/^\.claude\//, '.claude/'));
    assert.deepStrictEqual(hits, [],
      `'${entry.token}' is still named in ClauKit's own docs, so ${entry.path} can never be retired from any install`);
  }
});

test('the task-shape trigger table survives in what ships', () => {
  // This is the scope-lock fix, and it is the fragile kind: a table of rows in a
  // prose file, with nothing but this test between it and a well-meaning edit.
  //
  // It earned a test by a positive control with a rejected candidate first — the
  // same A/B halt delegated from fix-pipeline.md did NOT flip the scenario
  // (that run never opened the file), and this table did, reproducibly. Its rows
  // deliberately link the skills rather than restating them, so `cook` stays the
  // single home of the A/B rule; a row that grew its own copy of a rule would be
  // the duplication this whole design avoids.
  const f = path.join(REPO, '.claude/workflows/skill-activation.md');
  const text = fs.readFileSync(f, 'utf-8');
  assert.match(text, /Some task shapes force a specific gate/,
    'rule 3 says process precedes implementation but never which process for which task');
  for (const [shape, skill] of [
    [/>\s*1 repo or layer/, 'cook'],
    [/asserts existing behaviour/, 'verify-plan'],
    [/reported bug/, 'tdd'],
    [/interrupted work/, 'run-state'],
  ]) {
    assert.match(text, shape, `the trigger table lost a task shape`);
    assert.match(text, new RegExp(`skills/software/${skill}/SKILL\\.md`),
      `the ${skill} row must link the skill, not restate its rule`);
  }
});


test('no shipped doc links to a file the install does not have', () => {
  // Checked against a real install, not the repo: `.claude/commands/ck/cook.md`
  // linked `../../../README.md`, which resolves to ClauKit's own README here and
  // to the USER's unrelated README in any install — plausible-looking and wrong,
  // which is worse than dangling. `.claude/hooks/README.md` pointed twice at a
  // SETUP-SUMMARY.md that exists nowhere. Same principle `workflowLines` states:
  // a pointer to a file that is not there is worse than no pointer.
  const p = fresh();
  init(p);
  const VENDORED = 'node_modules';
  const walk = (dir, out = []) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.name === VENDORED) continue;               // vendored deps are not ours to fix
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full, out);
      else if (e.name.endsWith('.md')) out.push(full);
    }
    return out;
  };
  const broken = [];
  for (const f of walk(path.join(p, '.claude'))) {
    const text = fs.readFileSync(f, 'utf-8');
    for (const m of text.match(/\]\((\.\.?\/)[A-Za-z0-9_./-]+\.md\)/g) || []) {
      const rel = m.slice(2, -1);
      if (!fs.existsSync(path.resolve(path.dirname(f), rel))) {
        broken.push(`${path.relative(p, f)} -> ${rel}`);
      }
    }
  }
  assert.deepStrictEqual(broken, [], 'shipped docs must not point at files the install lacks');
});

test('cook pipeline rules have one home, and the command delegates to it', () => {
  // Both of these were found diverged: the command carried a ≤5-fix-cycles-per-
  // feature cap the skill did not, so every other consumer of the skill ran with
  // the ping-pong hole open; and the acceptance-criteria closing check lived only
  // in the command's Report section, so Stage 0 collected verifiable criteria
  // that nothing ever verified. A rule stated in two places drifts — these did.
  const skill = fs.readFileSync(path.join(REPO, 'skills/software/cook/SKILL.md'), 'utf-8');
  const cmd = fs.readFileSync(path.join(REPO, '.claude/commands/ck/cook.md'), 'utf-8');

  assert.match(skill, /5 fix cycles total per feature/, 'the feature-level cap belongs in the skill');
  assert.match(skill, /## |\*\*Closing gate/, 'the acceptance-criteria closing gate belongs in the skill');
  assert.match(skill, /every\*{0,2} Stage-0 acceptance criterion/i);

  assert.ok(!/5 fix cycles/.test(cmd), 'the command must delegate the cap, not restate its number');
  for (const section of ['Loop cap \\+ breaker', 'Closing gate']) {
    assert.match(cmd, new RegExp(`§ ${section}`), `the command must point at § ${section}`);
    assert.match(skill, new RegExp(section), `§ ${section} must exist in the skill it points at`);
  }
});

test('every cook stage and its exit gate survives into a shipped install', () => {
  // For five of these stages a behavioural scenario cannot discriminate: with the
  // rule removed the model still does the right thing, measured from both
  // directions. That is a fact about the model, and no amount of fixture work
  // changes it — harder fixtures were tried and measured not to help.
  //
  // What CAN still go wrong is the rule quietly disappearing. Nothing asserted
  // these rows survived a release, so a stage could be deleted and every test
  // would stay green. This is the guarantee that remains available, so it is the
  // one worth having: the pipeline a user installs still has all eight gates,
  // each with the exit criterion that makes it checkable.
  const p = fresh();
  init(p);
  const skill = fs.readFileSync(path.join(p, '.claude/skills/software/cook/SKILL.md'), 'utf-8');
  const stages = [
    ['0', 'Exact-Requirements Gate', /5 fields filled & confirmed/],
    ['0.5', 'Verify-Plan Gate', /verification table approved/],
    ['1', 'Plan', /Spec linked \+ impact diff produced/],
    ['2', 'Code', /per-phase exit gate green/],
    ['3', 'Test', /1 happy \+ 1 negative \+ 1 recovery/],
    ['4', 'Review', /Critical = 0 AND High = 0/],
    ['5', 'Docs', /Reviewer can use the feature with docs alone/],
    ['6', 'Deploy', /Smoke check passes; rollback path documented/],
  ];
  for (const [n, name, exitGate] of stages) {
    assert.match(skill, new RegExp(`\\|\\s*${n.replace('.', '\\.')}\\s*\\|\\s*\\*\\*${name}\\*\\*`),
      `stage ${n} (${name}) is missing from the shipped pipeline`);
    assert.match(skill, exitGate,
      `stage ${n} (${name}) shipped without its exit criterion — a gate with no way to check it is a heading`);
  }
  // The two rules that live outside the table because no single stage carries them.
  assert.match(skill, /Closing gate/, 'the acceptance-criteria closing gate must ship');
  assert.match(skill, /5 fix cycles total per feature/, 'the feature-level loop cap must ship');
});

// ---------- ClauKit's own tree: the skills pointer ----------

test('the skills pointer is untracked and ignored', () => {
  // `skills/` is canonical and `.claude/skills` points at it, regenerated per
  // platform by `npm run link-skills`. A TRACKED symlink is the one shape that
  // breaks: a Windows checkout without symlink support writes a text file
  // containing "../skills", link-skills replaces it with a junction, and the
  // tracked path then reads as permanently modified — or, on the copy fallback,
  // ~1500 untracked skill files. That is exactly what happened to the retired
  // `.agent/skills` target, which had no ignore rule at all, so the invariant is
  // asserted rather than left to the next reviewer.
  const git = (...args) => spawnSync('git', args, { cwd: REPO, encoding: 'utf-8' });
  assert.strictEqual(git('ls-files', '.claude/skills').stdout.trim(), '',
    '.claude/skills is regenerated per platform, so it must not be tracked');
  // check-ignore does not require the path to exist, so this holds on a fresh
  // checkout where link-skills has not run yet.
  assert.strictEqual(git('check-ignore', '-q', '.claude/skills').status, 0, '.claude/skills must be git-ignored');
  // `.agent/` was removed 2026-08-11 (see scripts/link-skills.js): nothing
  // recreates it, so nothing may track it either.
  assert.strictEqual(git('ls-files', '.agent').stdout.trim(), '',
    '.agent/ is retired — no target creates it, so a tracked entry there is a leftover');
});

test('the repo ships no script that nothing invokes', () => {
  // scripts/postinstall.js was wired to nothing for the package's whole life —
  // no `postinstall` entry, no husky hook, and root `scripts/` excluded from
  // `files`, so its "installed successfully" banner never printed for anyone,
  // while codebase-summary.md listed it as a live setup script. `ck --help`
  // already prints strictly more than the banner did.
  const pkg = JSON.parse(fs.readFileSync(path.join(REPO, 'package.json'), 'utf-8'));
  assert.ok(!fs.existsSync(path.join(REPO, 'scripts', 'postinstall.js')),
    'reintroducing it requires wiring it AND shipping it AND fixing its cwd-relative package.json read');
  for (const [name, cmd] of Object.entries(pkg.scripts || {})) {
    const m = cmd.match(/node\s+(scripts\/\S+)/);
    if (m) assert.ok(fs.existsSync(path.join(REPO, m[1])), `npm run ${name} points at a missing file: ${m[1]}`);
  }
});
