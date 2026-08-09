#!/usr/bin/env node

/**
 * tool-sequence.cjs — turn a `claude -p --output-format stream-json` log into
 * something a behavioural assertion can actually check.
 *
 * Why this exists: the first version of `tdd-red-first` asserted on final disk
 * state plus a `grep -qiE "AssertionError|FAIL"` over the prose. Both are
 * order-blind, and TDD is *entirely* an ordering property — "a test exists" and
 * "a test existed before the fix" are different claims, and only the second one
 * is the gate. So the scenario passed with its gate blanked, which by
 * development-rules.md § Behavioural-Skill Governance means it was measuring the
 * model's general competence, not the rule.
 *
 * Ordering lives in the tool-call sequence, so that is what this extracts.
 *
 * Three modes, one parse:
 *   (default)     TSV: idx <TAB> tool <TAB> target <TAB> outcome
 *   --render      ordered human-readable transcript (also what the text greps in
 *                 the other five scenarios read)
 *   --prose       ONLY what the model itself said — no tool inputs, no tool
 *                 results. An assertion of the form "the model stated X" must
 *                 read this: `--render` includes file contents, so a fixture
 *                 that happens to contain the asserted phrase satisfies the
 *                 grep the moment anything reads it. `verify-plan-fires` greps
 *                 for "returns a string" and its own fixture opens with
 *                 `// parse.js — returns a STRING, not an int`.
 *   --tdd-order <re>  exit 0 iff a test was written AND observed failing before
 *                 the first mutation of the file matching <re>. The invariant
 *                 lives here, not in the scenario's shell, so `npm test` can
 *                 cover it without a `claude -p` run.
 *
 * `outcome` is `ok` or `fail:<marker>`. A Bash step that exits non-zero is the
 * only way a scenario can prove a test was observed RED rather than merely
 * written.
 */

const fs = require("fs");

/** Failure markers, in the order they are worth reporting. */
const FAIL_MARKERS = [
  /AssertionError/i, /\bnot ok\b/i, /\bFAIL(ED|URE)?\b/, /✗/, /\bexit(ed)? (code )?[1-9]/i,
  /\bError\b:/, /Expected .* (but )?(got|received)/i,
];

/**
 * The untruncated command/path a tool acted on.
 *
 * `targetOf` caps at 160 chars so the TSV and the rendered transcript stay one
 * line each — right for display, wrong for matching. A `closing-gate` assertion
 * looked for `cli.js` in a Bash target and missed it twice: the run had chained
 * `cd … && echo "== AC1 ==" && node -e …` first, so the reference sat past the
 * cap. The run had done the work; the checker could not see it.
 */
function rawTargetOf(name, input) {
  if (!input || typeof input !== "object") return "";
  if (name === "Bash") return String(input.command || "");
  return String(input.file_path || input.path || input.pattern || input.notebook_path || "");
}

/** Which input field names the thing a tool acted on. */
function targetOf(name, input) {
  if (!input || typeof input !== "object") return "";
  const one = (s) => String(s).replace(/\s+/g, " ").trim().slice(0, 160);
  if (name === "Bash") return one(input.command || "");
  if (input.file_path) return one(input.file_path);
  if (input.path) return one(input.path);
  if (input.pattern) return one(input.pattern);
  if (input.notebook_path) return one(input.notebook_path);
  return one(JSON.stringify(input));
}

/** tool_result content arrives as a string or as an array of blocks. */
function textOf(content) {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content.map((b) => (typeof b === "string" ? b : b && b.type === "text" ? b.text : "")).join("\n");
  }
  return "";
}

function outcomeOf(result) {
  if (!result) return "ok";
  if (result.is_error) {
    const m = FAIL_MARKERS.find((r) => r.test(result.text));
    return `fail:${m ? result.text.match(m)[0].replace(/\s+/g, " ").slice(0, 40) : "tool-error"}`;
  }
  // Content-sniffing is for tools whose OUTPUT reports a run's outcome — a suite
  // that prints AssertionError while exiting 0 is a failing suite, and only the
  // text says so. For every other tool the text is just data the tool handed
  // back, and judging it by that text is the mistake the ERROR class already made
  // one level up: a successful `Read` of cook/SKILL.md was rendered
  // `fail:FAIL` because the skill documents `gate <name> → PASS|FAIL`, which sent
  // an investigation looking for a read error that never happened.
  if (result.tool && result.tool !== "Bash") return "ok";
  // ...and a Bash step that merely PRINTS a file is a read, not a run. `cat
  // .claude/skills/software/cook/SKILL.md` was rendered `fail:FAIL` for the same
  // reason the Read was: the skill documents `gate <name> → PASS|FAIL`.
  if (/^\s*(cat|head|tail|less|bat)\b/.test(result.command || "")) return "ok";
  const m = FAIL_MARKERS.find((r) => r.test(result.text));
  return m ? `fail:${result.text.match(m)[0].replace(/\s+/g, " ").slice(0, 40)}` : "ok";
}

/** Ordered steps + the assistant/final prose, from one pass over the log. */
function parse(lines) {
  const steps = [];
  const byId = new Map();
  const prose = [];

  for (const line of lines) {
    let ev;
    try {
      ev = JSON.parse(line);
    } catch {
      // Not JSON: an infrastructure notice printed straight to the stream. Keep
      // it — infra detection and the text greps both need to see it.
      if (line.trim()) prose.push({ at: steps.length, text: line });
      continue;
    }

    const blocks = (ev.message && Array.isArray(ev.message.content) && ev.message.content) || [];
    for (const b of blocks) {
      if (!b || typeof b !== "object") continue;
      if (b.type === "text" && b.text.trim()) prose.push({ at: steps.length, text: b.text });
      if (b.type === "tool_use") {
        const step = { idx: steps.length + 1, tool: b.name, target: targetOf(b.name, b.input),
                       raw: rawTargetOf(b.name, b.input), result: null };
        steps.push(step);
        if (b.id) byId.set(b.id, step);
      }
      if (b.type === "tool_result") {
        const step = byId.get(b.tool_use_id);
        // Carry the tool name onto the result: outcomeOf must know whether this text
        // is a run's report or just a file it handed back.
        const rec = { is_error: !!b.is_error, text: textOf(b.content), tool: step ? step.tool : null,
                            command: step ? step.raw : "" };
        if (step) step.result = rec;
        else prose.push({ at: steps.length, text: rec.text });
      }
    }
    if (ev.type === "result" && typeof ev.result === "string" && ev.result.trim()) {
      prose.push({ at: steps.length, text: ev.result });
    }
  }
  return { steps, prose };
}

const MUTATORS = new Set(["Write", "Edit", "NotebookEdit"]);
/** A Bash command that writes to a file rather than reading it. */
const BASH_WRITE = /(^|\s)(>|>>|sed -i|tee\s|patch\s)/;
const TEST_PATH = /(test|spec)/i;
/**
 * A command running a test SUITE — not merely a command containing "node".
 *
 * `node\s` was in this pattern and it made the check unsound: an exploratory
 * `node .claude/hooks/file-claims.cjs …` that exited non-zero was credited as
 * "a test was observed failing", at a step before the test file even existed. A
 * red run has to be a run of the test, so it is matched on a suite runner or on
 * the name of the file the run actually wrote.
 */
const TEST_RUN = /(npm|yarn|pnpm|bun)\s+(run\s+)?te?st|jest|vitest|mocha|pytest|go\s+test|cargo\s+test/i;

/**
 * Red-before-green, as an ordering property of the tool sequence.
 * Returns { ok, why, steps: {prod, written, red} }.
 */
function tddOrder(steps, prodRe) {
  const at = (pred) => {
    const s = steps.find(pred);
    return s ? s.idx : null;
  };
  const prod = at((s) =>
    (MUTATORS.has(s.tool) && prodRe.test(s.target)) ||
    (s.tool === "Bash" && prodRe.test(s.target) && BASH_WRITE.test(s.target))
  );
  const writtenStep = steps.find((s) => MUTATORS.has(s.tool) && TEST_PATH.test(s.target));
  const written = writtenStep ? writtenStep.idx : null;
  // The red run must come AFTER the test exists and must name it (or invoke the
  // suite). Reproducing a bug with an ad-hoc assertion is good debugging, but it
  // is not "the regression test was seen failing" — conflating them is what let a
  // fix-first run look disciplined.
  const testBase = writtenStep ? String(writtenStep.target).split(/[/\\]/).pop() : null;
  const red = at((s) =>
    s.tool === "Bash" && /^fail/.test(outcomeOf(s.result)) && written !== null && s.idx > written &&
    (TEST_RUN.test(s.target) || (testBase && s.target.includes(testBase)))
  );
  const found = { prod, written, red };

  if (!prod) return { ok: false, why: `${prodRe} was never mutated through a tool — cannot judge ordering`, steps: found };
  if (!written) return { ok: false, why: "no regression test was written — the fix is unprotected", steps: found };
  // Ordering is checked before the existence of red, because a post-hoc test is
  // usually ALSO never-red, and "written after the fix" is the sharper diagnosis
  // of the two. Reporting the vaguer one sends the reader looking in the wrong
  // place for a run that is failing for a very specific reason.
  if (written > prod) return { ok: false, why: `test written at step ${written}, AFTER the fix at step ${prod} — post-hoc test`, steps: found };
  if (!red) return { ok: false, why: "no test was ever observed failing — red was never demonstrated", steps: found };
  if (red > prod) return { ok: false, why: `test first failed at step ${red}, AFTER the fix at step ${prod} — green before red`, steps: found };
  return { ok: true, why: `test written @${written}, observed red @${red}, fix @${prod}`, steps: found };
}

/**
 * Evidence-before-implementation, as an ordering property of the tool sequence.
 *
 * Written after `verify-plan-fires` survived 3 of 3 ablated runs. Its assertion
 * was "the source is unedited AND the prose says the claim is false", and a
 * capable model does both unaided — the ablated tree was checked and contained
 * no trace of the rule, so it was inventing the whole verification report by
 * itself. What the gate demands and unaided care does not is the *act*: run the
 * command the plan cites as its evidence, and run it before touching anything.
 * Prose cannot distinguish a checked claim from a plausible-sounding one; the
 * tool sequence can.
 *
 * Returns { ok, why, steps: { evidence, mutation } }.
 */
function evidenceBefore(steps, evidenceRe, mutRe) {
  const eviStep = steps.find((s) => s.tool === "Bash" && evidenceRe.test(s.target));
  const mutStep = steps.find((s) =>
    (MUTATORS.has(s.tool) && mutRe.test(s.target)) ||
    (s.tool === "Bash" && mutRe.test(s.target) && BASH_WRITE.test(s.target))
  );
  const evidence = eviStep ? eviStep.idx : null;
  const mutation = mutStep ? mutStep.idx : null;
  const found = { evidence, mutation };

  if (evidence === null) {
    return { ok: false, steps: found,
      why: `the plan cites evidence (${evidenceRe}) but no command was ever run against it — the claim was taken on trust` };
  }
  if (mutation !== null && mutation < evidence) {
    return { ok: false, steps: found,
      why: `${mutRe} mutated at step ${mutation}, BEFORE the cited claim was checked at step ${evidence}` };
  }
  return { ok: true, steps: found,
    why: `claim checked @${evidence}${mutation === null ? ", no mutation" : `, mutation @${mutation}`}` };
}

function main() {
  const [file, ...flags] = process.argv.slice(2);
  if (!file) {
    console.error("usage: tool-sequence.cjs <events.jsonl> [--render | --tdd-order <prod-regex>]");
    process.exit(2);
  }
  const lines = fs.readFileSync(file, "utf-8").split("\n");
  const { steps, prose } = parse(lines);

  const orderIdx = flags.indexOf("--tdd-order");
  if (orderIdx !== -1) {
    const pattern = flags[orderIdx + 1];
    if (!pattern) { console.error("--tdd-order needs a regex for the production file"); process.exit(2); }
    if (!steps.length) { console.error("no tool calls in the stream — nothing to order"); process.exit(1); }
    const v = tddOrder(steps, new RegExp(pattern));
    console.log(v.why);
    process.exit(v.ok ? 0 : 1);
  }

  const eviIdx = flags.indexOf("--evidence-before");
  if (eviIdx !== -1) {
    const evidencePattern = flags[eviIdx + 1];
    const mutPattern = flags[eviIdx + 2];
    if (!evidencePattern || !mutPattern) {
      console.error("--evidence-before needs <evidence-regex> <mutation-regex>"); process.exit(2);
    }
    if (!steps.length) { console.error("no tool calls in the stream — nothing to order"); process.exit(1); }
    const v = evidenceBefore(steps, new RegExp(evidencePattern), new RegExp(mutPattern));
    console.log(v.why);
    process.exit(v.ok ? 0 : 1);
  }

  if (flags.includes("--prose")) {
    // parse() files a tool_result under `prose` only when it has no matching
    // tool_use, so filter those out too: they are still tool output.
    const results = new Set();
    for (const s of steps) if (s.result) results.add(s.result.text);
    for (const p of prose) if (!results.has(p.text)) console.log(p.text);
    return;
  }

  if (!flags.includes("--render")) {
    for (const s of steps) {
      console.log([s.idx, s.tool, s.target, outcomeOf(s.result)].join("\t"));
    }
    return;
  }

  // Interleave prose with the steps it preceded, so the rendered transcript
  // reads in real order and a line-number grep reflects the actual sequence.
  let p = 0;
  const flush = (upto) => {
    while (p < prose.length && prose[p].at <= upto) console.log(prose[p++].text);
  };
  for (const s of steps) {
    flush(s.idx - 1);
    console.log(`[tool ${s.idx}: ${s.tool}] ${s.target}`);
    if (s.result) console.log(`[result ${s.idx}: ${outcomeOf(s.result)}] ${s.result.text.slice(0, 2000)}`);
  }
  flush(Infinity);
}

if (require.main === module) main();
module.exports = { parse, outcomeOf, targetOf, rawTargetOf, tddOrder, evidenceBefore };
