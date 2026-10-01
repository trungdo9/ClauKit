#!/usr/bin/env node
/**
 * Route grader: did the model reach for the right skill BEFORE it started editing?
 *
 * A "route" is the first thing the model does that commits it to a methodology:
 * reading a skill's SKILL.md (by Read or by cat), invoking the Skill tool, or
 * reading a slash command's file. Everything else — the registry, workflows,
 * references/*.md, CLAUDE.md — is orientation and stays neutral, so reading the
 * registry first does not cost a case.
 *
 * Commands link their skills, so a run that opens `ck:fix` has routed to whatever
 * `fix.md` delegates to; `commandAliases` maps command -> skills it links.
 *
 *   node route-grade.cjs <events.jsonl> --expected cook,tdd [--commands <dir>]
 *     prints the verdict JSON.
 *     Exit codes (phase 04 keys on them): 0 PASS, 1 FAIL, 2 error (bad usage,
 *     unreadable events/commands dir, crash) -- an error is not a verdict.
 */

const fs = require('node:fs');
const path = require('node:path');
const { parse, MUTATORS, BASH_WRITE } = require('../tool-sequence.cjs');

/** `.../skills/<group>/<name>/SKILL.md` -> name (the directory, not the group). */
const SKILL_MD = /skills\/(?:[^/]+\/)*([^/]+)\/SKILL\.md$/;
const COMMAND_MD = /(?:^|\/)\.claude\/commands\/([^/]+)\/([^/]+)\.md$/;
/** Shell readers that count as "opening" a file, as opposed to writing or listing it. */
const BASH_READER = /^\s*(cat|head|tail|sed -n|less|bat)\b/;
/** Command separators; each segment is judged on its own so `cd x && cat <path>` reads. */
const BASH_SEGMENTS = /&&|\|\||[;|\n]/;

/** The skill name a path points at, or null. A `#anchor` does not change the file. */
function skillOfPath(p) {
  const m = SKILL_MD.exec(String(p).split('#')[0]);
  return m ? m[1] : null;
}

/**
 * Route token for one step: "cook" | "ck:fix" | null (neutral).
 * A step whose result is_error routed nowhere (failed Skill, Read of a missing
 * file): the attempt is neutral, so a wrong-name stumble is not scored and an
 * unregistered `Skill("tdd")` cannot pass without the methodology being read.
 * A bare Skill name is only a route if aliased: grouped skills never register in
 * an install, and the bare names that do register are harness built-ins
 * (code-review) that share a name with a kit skill but are not its file.
 */
function routeOf(step, aliases) {
  if (step.result && step.result.is_error) return null;
  const input = step.input || {};
  if (step.tool === 'Skill') {
    const name = input.skill ? String(input.skill) : '';
    return name.includes(':') || (aliases && aliases.has(name)) ? name : null;
  }
  if (step.tool === 'Read') {
    const file = String(input.file_path || '');
    const skill = skillOfPath(file);
    if (skill) return skill;
    const cmd = COMMAND_MD.exec(file);
    return cmd ? `${cmd[1]}:${cmd[2]}` : null;
  }
  if (step.tool === 'Bash') {
    for (const seg of String(input.command || '').split(BASH_SEGMENTS)) {
      if (!BASH_READER.test(seg)) continue;
      for (const tok of seg.split(/\s+/)) {
        const skill = skillOfPath(tok.replace(/^["']|["']$/g, ''));
        if (skill) return skill;
      }
    }
  }
  return null;
}

/** Redirects that discard output or duplicate an fd write no file; BASH_WRITE cannot tell. */
const NOISE_REDIRECT = /\d*>>?\s*\/dev\/null|\d*>&\d+/g;

/** An attempt counts, whatever its outcome: a denied Write is still the wrong order. */
function isMutation(step) {
  if (MUTATORS.has(step.tool)) return true;
  const cmd = (step.input && step.input.command) || '';
  return step.tool === 'Bash' && BASH_WRITE.test(cmd.replace(NOISE_REDIRECT, ' '));
}

/** Map "<ns>:<x>" -> Set of skill names the command file links to. */
function commandAliases(commandsDir) {
  const out = new Map();
  for (const ns of fs.readdirSync(commandsDir, { withFileTypes: true })) {
    if (!ns.isDirectory()) continue;
    for (const f of fs.readdirSync(path.join(commandsDir, ns.name))) {
      if (!f.endsWith('.md')) continue;
      const body = fs.readFileSync(path.join(commandsDir, ns.name, f), 'utf-8');
      const skills = new Set();
      for (const m of body.matchAll(/\]\(([^)\s]+)\)/g)) {
        const s = skillOfPath(m[1]);
        if (s) skills.add(s);
      }
      out.set(`${ns.name}:${f.slice(0, -3)}`, skills);
    }
  }
  return out;
}

/** Does the route satisfy `expected`, directly or through a command's linked skills? */
function routeMatches(route, expected, aliases) {
  if (expected.includes(route)) return true;
  const linked = aliases && aliases.get(route);
  return !!linked && expected.some((e) => linked.has(e));
}

/** PASS iff the first route is expected and no mutation came before it. */
function gradeRoute(steps, expected, aliases = new Map()) {
  const first = steps.find((s) => routeOf(s, aliases) !== null);
  const mut = steps.find(isMutation);
  const route = first ? routeOf(first, aliases) : null;
  const routeIdx = first ? first.idx : null;
  const mutationIdx = mut ? mut.idx : null;
  const verdict = (ok, why) => ({ verdict: ok ? 'PASS' : 'FAIL', route, routeIdx, mutationIdx, why });
  if (!first) return verdict(false, 'no-route');
  if (!routeMatches(route, expected, aliases)) return verdict(false, `wrong-route:${route}`);
  if (mutationIdx !== null && mutationIdx < routeIdx) return verdict(false, `mutation-first@${mutationIdx}`);
  return verdict(true, 'ok');
}

function main() {
  const argv = process.argv.slice(2);
  const flag = (name) => (argv.includes(name) ? argv[argv.indexOf(name) + 1] : null);
  const file = argv.find((a) => !a.startsWith('--') && a !== flag('--expected') && a !== flag('--commands'));
  const expected = (flag('--expected') || '').split(',').filter(Boolean);
  if (!file || !expected.length) {
    console.error('usage: route-grade.cjs <events.jsonl> --expected a,b [--commands <dir>]');
    process.exit(2);
  }
  let g;
  try {
    const dir = flag('--commands') || path.join(__dirname, '..', '..', '..', '.claude', 'commands');
    const { steps } = parse(fs.readFileSync(file, 'utf-8').split('\n'));
    g = gradeRoute(steps, expected, commandAliases(dir));
  } catch (e) {
    console.error(`error: ${e.code || e.name}`);
    process.exit(2);
  }
  console.log(JSON.stringify(g));
  process.exit(g.verdict === 'PASS' ? 0 : 1);
}

if (require.main === module) main();
module.exports = { routeOf, isMutation, commandAliases, gradeRoute, skillOfPath };
