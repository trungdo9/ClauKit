#!/usr/bin/env node

/**
 * ci-review.js — provider-agnostic headless PR review (T4.2).
 *
 * Usage: node scripts/ck/ci-review.js <BASE> [HEAD] [--post <pr-number>] [--dry-run]
 *
 * Runs `claude -p` over the PR diff with a NARROW tool grant
 * (Read, Grep, Bash(git diff:*), Bash(git log:*)) and emits
 * CRITICAL/HIGH/MEDIUM findings with file:line + a concrete fix.
 * Reads the repo's CLAUDE.md conventions; flags cross-service deploy-order
 * risk and secrets in the tree. Provider wrappers stay ~15 lines — all the
 * logic lives here (see .github/workflows/ck-review.yml.template).
 *
 * --post <n>  additionally post the review as a PR comment via `gh`
 * --dry-run   print the composed prompt and exit (no claude invocation)
 *
 * Exit: 0 review produced · 1 setup error (bad refs, claude missing)
 */

const fs = require('fs');
const path = require('path');
const { git, assertRef, run, repoRoot, die } = require('./lib/common');

const ALLOWED_TOOLS = 'Read,Grep,Glob,Bash(git diff:*),Bash(git log:*),Bash(git show:*)';

function main() {
  const argv = process.argv.slice(2);
  const dryRun = argv.includes('--dry-run');
  const postIdx = argv.indexOf('--post');
  const postPr = postIdx !== -1 ? argv[postIdx + 1] : null;
  const positional = argv.filter((a, i) => !a.startsWith('--') && argv[i - 1] !== '--post');
  const [base, headArg] = positional;
  if (!base) die('usage: ci-review.js <BASE> [HEAD] [--post <pr-number>] [--dry-run]');
  const head = headArg || 'HEAD';

  const root = repoRoot();
  if (!root) die('not inside a git repository');

  // Refs here come from CI context (`origin/${{ github.base_ref }}`), i.e. from
  // whoever opened the PR. argv only — never a shell string.
  assertRef(base, 'BASE');
  assertRef(head, 'HEAD');

  let baseSha, headSha, stat;
  try {
    baseSha = git(['rev-parse', '--short', base], { cwd: root });
    headSha = git(['rev-parse', '--short', head], { cwd: root });
    stat = git(['diff', '--stat', `${baseSha}...${headSha}`], { cwd: root });
  } catch (e) {
    die(`cannot resolve diff range: ${e.message}`);
  }

  const claudeMd = path.join(root, 'CLAUDE.md');
  const conventionsNote = fs.existsSync(claudeMd)
    ? 'Read CLAUDE.md first — findings that contradict the project\'s own conventions are invalid; findings that ENFORCE them are wanted.'
    : 'No CLAUDE.md present; review against general engineering conventions.';

  const prompt = [
    `Review the diff ${baseSha}...${headSha} (read it with \`git diff ${baseSha}...${headSha}\`; per-file context via Read).`,
    conventionsNote,
    '',
    'Report ONLY findings that survive your own re-check, as:',
    '  SEVERITY(CRITICAL|HIGH|MEDIUM) · file:line · what breaks (concrete failure scenario) · concrete fix',
    '',
    'Mandatory checks beyond general correctness:',
    '- cross-service deploy-order risk: does this change call an endpoint/contract that must deploy first? Say which side ships first.',
    '- secrets in the tree: keys, tokens, credentials, connection strings in the diff.',
    '- dropped guards: removed permission/status checks, widened queries, non-atomic mutation sequences.',
    '',
    'Admissibility: every finding cites file:line or verbatim output. No evidence → do not report it.',
    'End with: `VERDICT: PASS` (0 critical, 0 high) or `VERDICT: FAIL`.',
  ].join('\n');

  if (dryRun) {
    console.log(`# would run: claude -p --allowedTools "${ALLOWED_TOOLS}"`);
    console.log(prompt);
    console.log(`\n# diff stat:\n${stat}`);
    return;
  }

  const res = run('claude', ['-p', prompt, '--allowedTools', ALLOWED_TOOLS], {
    cwd: root,
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 32 * 1024 * 1024,
  });
  if (res.error && res.error.code === 'ENOENT') die('claude CLI not found on PATH');
  const review = (res.stdout || '').trim();
  if (res.status !== 0 || !review) die(`claude -p failed:\n${(res.stderr || '').slice(-2000)}`);

  console.log(review);

  if (postPr) {
    const post = run('gh', ['pr', 'comment', postPr, '--body', `## ck-review (${baseSha}...${headSha})\n\n${review}`], { cwd: root });
    if (post.status !== 0) {
      console.error(`\n[ci-review] gh comment failed — paste-ready fallback:\n  gh pr comment ${postPr} --body-file <(cat <<'EOF'\n${review}\nEOF\n)`);
    }
  }

  // The verdict never reached the exit code, so a CI step went green on a
  // review whose body said FAIL — the one signal the wrapper actually gates on.
  // Opt-in, so adding the workflow does not start blocking merges unannounced.
  if (argv.includes('--fail-on-verdict') && /VERDICT:\s*FAIL/i.test(review)) {
    console.error('\n[ci-review] review verdict is FAIL — exiting non-zero (--fail-on-verdict).');
    process.exit(1);
  }
}

main();
