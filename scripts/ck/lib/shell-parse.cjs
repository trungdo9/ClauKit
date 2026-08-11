/**
 * shell-parse.cjs — find the git invocations inside a Bash command string.
 *
 * WHY THIS IS A FILE. `branch-checks.cjs` decides whether a HEAD move is
 * allowed; it can only decide about moves it can SEE. Three parsing gaps meant
 * it saw nothing, and each one is the shape an agent writes by default:
 *
 *   `git add -A\ngit checkout -b x`      newline is a separator; the old regex
 *                                        `/&&|\|\||[;|]/` had no `\n` and no
 *                                        single `&`, so this was ONE segment
 *                                        whose first token is not `git`.
 *   `git --no-pager checkout -b x`       the option-skipping loop whitelisted
 *                                        four global options and broke on the
 *                                        fifth, leaving `--no-pager` as the
 *                                        subcommand.
 *   `sh -c "git switch -c x" && echo hi` the wrapper pattern was anchored to the
 *                                        whole line, so trailing text made it
 *                                        miss, and `sh -c "…"` then read as an
 *                                        invocation of `sh`.
 *
 * All three returned ALLOW with zero classified ops — silence indistinguishable
 * from "nothing to guard". Parsing lives here, alone, so a gap of this kind is
 * a unit test rather than an end-to-end run.
 *
 * Quote state is tracked rather than regex-split because separators inside a
 * quoted string are not separators: `echo "a && git checkout -b x"` executes no
 * git at all, and denying it would have been the price of noticing `&`.
 */

/** Split a command line into segments on UNQUOTED separators. */
function splitSegments(text) {
  const segs = [];
  let buf = '';
  let quote = null;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quote) {
      if (ch === '\\' && quote === '"' && i + 1 < text.length) { buf += ch + text[++i]; continue; }
      buf += ch;
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") { quote = ch; buf += ch; continue; }
    if (ch === '&' || ch === '|' || ch === ';' || ch === '\n' || ch === '\r') {
      if ((ch === '&' || ch === '|') && text[i + 1] === ch) i++;   // one break for `&&` / `||`
      segs.push(buf);
      buf = '';
      continue;
    }
    buf += ch;
  }
  segs.push(buf);
  return segs;
}

/**
 * `bash -lc "<payload>"` and friends — the `c` may be bundled into a flag
 * cluster. Deliberately NOT anchored: `(?:^|[\s;|&])` lets a wrapper be found
 * wherever it sits, and the text around it is still classified.
 */
const WRAPPER = /(?:^|[\s;|&])((?:[A-Za-z_][A-Za-z0-9_]*=\S*\s+)*(?:\S*\/)?(?:ba|z|da)?sh\s+(?:-[a-z]+\s+)*-[a-z]*c\s+)(['"])([\s\S]*?)\2/g;

/**
 * Every command segment in a line, with shell wrappers expanded in place so a
 * wrapped payload's segments appear where the wrapper stood. Depth-capped: a
 * `sh -c` nest three deep is pathological, and unbounded recursion on
 * attacker-shaped input is its own bug.
 */
function commandSegments(cmd, depth = 0) {
  const text = String(cmd);
  const out = [];
  let cursor = 0;
  if (depth < 3) {
    for (const m of text.matchAll(WRAPPER)) {
      out.push(...splitSegments(text.slice(cursor, m.index)));
      out.push(...commandSegments(m[3], depth + 1));
      cursor = m.index + m[0].length;
    }
  }
  out.push(...splitSegments(text.slice(cursor)));
  return out;
}

/**
 * Command prefixes that run another command — the subcommand hides one level
 * deeper. `env git checkout -b x` moves HEAD; `basename('env') !== 'git'` said
 * otherwise.
 */
const LAUNCHERS = new Set(['env', 'command', 'nohup', 'time', 'nice', 'stdbuf', 'setsid', 'sudo', 'doas']);

/**
 * git global options that consume the NEXT token. Anything else starting with
 * `-` is a valueless global option (`--no-pager`, `-P`, `--bare`) and is simply
 * dropped — a four-entry whitelist plus `break` was the bug.
 */
const GIT_VALUE_OPTS = new Set(['-C', '-c', '--git-dir', '--work-tree', '--namespace', '--exec-path', '--config-env', '--super-prefix']);

/** Strip surrounding quotes from a token (`git checkout -b "feat/x"`). */
const unquote = s => s.replace(/^(['"])([\s\S]*)\1$/, '$2');

/**
 * The git argv of one segment — `VAR=1` prefixes, launcher wrappers and git
 * global options removed — or null when the segment does not run git.
 */
function normalizeSegment(seg) {
  const tokens = String(seg).trim().split(/\s+/).filter(Boolean);
  for (;;) {
    while (tokens.length && /^[A-Za-z_][A-Za-z0-9_]*=/.test(tokens[0])) tokens.shift();
    if (!tokens.length) return null;
    const bin = unquote(tokens[0]).split(/[/\\]/).pop().replace(/\.exe$/i, '');
    if (bin === 'git') break;
    if (!LAUNCHERS.has(bin)) return null;
    tokens.shift();
    while (tokens.length && tokens[0].startsWith('-')) tokens.shift();   // the launcher's own flags
  }
  tokens.shift();
  while (tokens.length && tokens[0].startsWith('-')) {
    if (tokens[0].includes('=')) { tokens.shift(); continue; }             // --git-dir=/x
    if (GIT_VALUE_OPTS.has(tokens[0])) { tokens.splice(0, 2); continue; }  // -C /x
    tokens.shift();                                                       // --no-pager, -P
  }
  return tokens.length ? tokens : null;
}

module.exports = { splitSegments, commandSegments, normalizeSegment, unquote, WRAPPER, LAUNCHERS, GIT_VALUE_OPTS };
