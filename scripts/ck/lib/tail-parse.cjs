/**
 * tail-parse.cjs — read a declared delivery tail out of markdown and substitute
 * its values. No execution, no filesystem, no approval: this is the part that
 * turns untrusted text into steps, and it is the part six defects lived in.
 *
 * WHY THIS IS A FILE. The executor was one 357-line unit — parsing,
 * substitution, approval and execution with nothing to test them at separately
 * — and every defect had the same shape: a parse that silently produced the
 * WRONG step and then ran it.
 *   · a name line the regexes did not match started no step, so the following
 *     `run:` overwrote the PREVIOUS step's command: one step's command ran,
 *     reported DONE under another step's name, and the declared step never ran;
 *   · the block ended only at `## `, so an H1 later in CLAUDE.md did not close
 *     it and bullets from unrelated sections were executed as steps;
 *   · an unbackticked `done-when` was split at the FIRST `=`, so
 *     `curl -s http://x/y?a=b` became the command `curl -s http://x/y?a`
 *     expecting `b` — a check that can never pass, so the step ran every time.
 *
 * The rules these violate are canonical in skills/software/git/SKILL.md: only
 * declared steps are steps, and a re-run must produce no second write.
 */

/**
 * Extract the `## Delivery tail` section; returns raw markdown or null.
 * Terminated by any H1 or H2 — a sibling-or-higher heading ends a section, and
 * stopping only at `## ` left the block open to the end of the file.
 */
function extractTailBlock(md) {
  const lines = md.split('\n');
  const start = lines.findIndex(l => /^##\s+Delivery tail/i.test(l));
  if (start === -1) return null;
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^#{1,2}\s/.test(lines[i])) { end = i; break; }
  }
  return lines.slice(start + 1, end).join('\n');
}

/**
 * Remove everything that is illustrative rather than declared.
 *
 * HTML comments were handled; fenced code blocks were not — so a team that
 * documented the format ("here is what a step looks like, we don't use it
 * yet") had their example executed on the next `/ck:git pr`.
 */
function stripInert(block) {
  return block
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/^[ \t]*(`{3,}|~{3,})[^\n]*\n[\s\S]*?^[ \t]*\1[ \t]*$/gm, '');
}

/** `- **name**` (trailing prose allowed) or `- name`. */
const TOP_BOLD = /^-\s+\*\*(.+?)\*\*(.*)$/;
const TOP_PLAIN = /^-\s+(\S.*?)\s*$/;
/** Indentation is cosmetic in markdown, so a flush `- run:` is still a sub-key. */
const SUB = /^\s*-\s+(run|needs|done-when|on-fail):\s*(.+)$/;

/**
 * Parse declared steps. Returns { steps, bad, warn }:
 *   steps — has a `run`, will execute
 *   bad   — named but no `run:`, reported and skipped
 *   warn  — parse ambiguities that used to resolve silently and wrongly
 *
 * A key is never overwritten. That single rule is what closes the dropped-step
 * defect for good: whatever the name line looks like, a second `run:` can no
 * longer replace a command already declared for the current step.
 */
function parseSteps(block) {
  const steps = [];
  const bad = [];
  const warn = [];
  let current = null;
  const flush = () => { if (current) (current.run ? steps : bad).push(current); };

  for (const line of stripInert(block).split('\n')) {
    const sub = line.match(SUB);
    if (sub) {
      const [, key, value] = sub;
      if (!current) { warn.push(`'${key}:' appears before any step name — ignored: ${value.trim()}`); continue; }
      if (current[key] !== undefined) {
        warn.push(`step '${current.name}': a second '${key}:' was ignored (${value.trim()}) — the first one stands`);
        continue;
      }
      current[key] = value.trim();
      continue;
    }
    const bold = line.match(TOP_BOLD);
    const plain = bold ? null : line.match(TOP_PLAIN);
    if (bold || plain) {
      flush();
      current = { name: (bold ? bold[1] : plain[1]).trim() };
    }
  }
  flush();
  return { steps, bad, warn };
}

/**
 * `` `cmd` = `expected` `` → {cmd, expected}. An empty or absent expected means
 * "satisfied iff the command exits 0". Backticks are optional, but the
 * unbackticked form requires a SPACED ` = `: splitting at the first bare `=`
 * truncated every command containing one (`?a=b`, `--flag=value`, `KEY=val`).
 */
function parseDoneWhen(raw) {
  if (!raw) return null;
  const m = raw.match(/^`([^`]+)`\s*(?:=\s*`([^`]*)`)?\s*$/)
    || raw.match(/^(.+?)\s+=\s+(.*)$/);
  if (!m) return { cmd: raw.trim(), expected: null };
  const expected = (m[2] || '').trim();
  return { cmd: m[1].trim(), expected: expected === '' ? null : expected };
}

function strip(s) {
  return s.replace(/^`|`$/g, '').trim();
}

/**
 * Shell metacharacters in a SUBSTITUTED value. The declared `run:` is the
 * project's own shell command and may contain anything; a value spliced into
 * it may not, or the value chooses the command.
 *
 * `{{branch}}` is the sharp one: git accepts `;`, backtick, `$`, `|` and `&`
 * in a branch name, and `gh pr checkout <n>` gives a fork contributor's
 * head-ref name to the local branch. A benign declared step
 * (`echo shipped {{branch}}`) then executes their payload and reports DONE.
 */
const UNSAFE_VALUE = /[;&|`$<>(){}\n\r"'\\]/;

/**
 * Substitute {{name}}. Returns {text, missing, unsafe} — never emits a literal
 * {{…}}, and never splices a value that could restructure the command.
 */
function resolve(text, ctx) {
  const missing = [];
  const unsafe = [];
  const out = String(text).replace(/\{\{\s*([\w.-]+)\s*\}\}/g, (_, k) => {
    if (!Object.prototype.hasOwnProperty.call(ctx, k)) {
      missing.push(k);
      return `{{${k}}}`;
    }
    const v = String(ctx[k]);
    if (UNSAFE_VALUE.test(v)) {
      unsafe.push(`${k}=${JSON.stringify(v)}`);
      return `{{${k}}}`;
    }
    return v;
  });
  return { text: out, missing: [...new Set(missing)], unsafe: [...new Set(unsafe)] };
}

module.exports = { extractTailBlock, stripInert, parseSteps, parseDoneWhen, strip, resolve, UNSAFE_VALUE };
