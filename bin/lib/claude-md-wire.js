/**
 * claude-md-wire.js — make the installed workflows actually load.
 *
 * Why this exists: `ck init` copies `.claude/workflows/*.md`, but Claude Code
 * only auto-reads `CLAUDE.md`. Nothing else pulls those files into a session,
 * so on a fresh install every workflow gate — the skill-activation hard gate,
 * the 13-stage primary workflow, the development rules — sat on disk
 * referenced by nothing. ClauKit's own repo hid the bug: its root CLAUDE.md has
 * a §Workflows section, which is the only reason the gates fire here.
 *
 * Measured, not theorised. The same behavioural scenario (a plan carrying a
 * false root-cause claim, prompt "Implement plans/fix-parse/plan.md") on two
 * installs differing by this one variable:
 *
 *   bare `ck init`        → source edited, false claim flagged only afterwards
 *   + CLAUDE.md §Workflows → no edit, claim explicitly REFUTED first
 *
 * This is settings-merge.js's defect one level up: hooks need settings.json to
 * be wired, workflows need CLAUDE.md. Same remedy — add what is missing, never
 * touch what the user wrote, and say what changed.
 */

const fs = require("fs");
const path = require("path");

/** Marker identifying a section this installer generated. */
const MARKER = "<!-- ck:workflows -->";

/**
 * Human labels for the workflows a kit can ship. The skill-activation entry is
 * deliberately bolded and annotated: it is a hard gate, and a gate that reads
 * like a reference link gets skimmed past.
 */
const LABELS = {
  "primary-workflow.md": "Primary workflow",
  "skill-activation.md": "**Skill activation (hard gate — read before any response or action)**",
  "development-rules.md": "Development rules",
  "orchestration-protocol.md": "Orchestration protocols",
  "documentation-management.md": "Documentation management",
  "fix-pipeline.md": "Fix pipeline (`/ck:fix` family)",
  "cro-framework.md": "CRO framework",
  "marketing-workflow.md": "Marketing workflow",
  "seo-workflow.md": "SEO workflow",
  "sales-workflow.md": "Sales workflow",
  "crm-workflow.md": "CRM workflow",
  "video-workflow.md": "Video workflow",
  "design-workflow.md": "Design workflow",
  "marketing-rules.md": "Marketing rules",
  "automation-rules.md": "Automation rules",
};

/** Fall back to a readable label so an unlisted workflow still gets wired. */
function labelFor(file) {
  if (LABELS[file]) return LABELS[file];
  return file
    .replace(/\.md$/, "")
    .replace(/[-_]/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase());
}

/**
 * The workflow bullet list for a kit, limited to files that actually landed in
 * the project — a pointer to a file that is not there is worse than no pointer.
 */
function workflowLines(projectRoot, kit) {
  const declared = (kit && kit.manifest && kit.manifest.paths && kit.manifest.paths.workflows) || [];
  const lines = [];
  for (const rel of declared) {
    if (!fs.existsSync(path.join(projectRoot, rel))) continue;
    lines.push(`- ${labelFor(path.basename(rel))}: \`./${rel}\``);
  }
  return lines;
}

/**
 * Operative rules — not pointers, and that distinction decides where they live.
 *
 * A behavioural eval caught a run that opened NONE of the linked workflow files:
 * CLAUDE.md is auto-loaded, everything it links to is read only if the model
 * decides to. A rule that must fire BEFORE any reading cannot live behind a link.
 *
 * Each is one line, so gate ablation in tests/behavior strips it atomically —
 * split across lines, a `sed`-based ablation removes only the matching half and
 * the negative control then measures a half-live rule.
 *
 * The key is what identifies a rule across versions. Matching on the full text
 * would mean any improvement to the wording appends a second copy instead of
 * recognising the first.
 */
const RULES = [
  {
    key: "These workflow files are instructions",
    text: `**IMPORTANT:** These workflow files are instructions, not documentation. Read the ones relevant to the task before acting.`,
  },
  {
    key: "**Hard stop —",
    text: `**Hard stop — a refuted premise ends the run; it is not repaired in passing.** When a plan, ticket, or root cause asserts something about *existing* behaviour and checking shows the claim is false, stop and report it. Do not quietly do the missing work yourself and carry on: a measured run inspected a plan's cited commit, found it was a no-op, performed the missing migration on one file, and shipped the change that depended on it — the premise had said *every* producer.`,
    // The citation is dropped when the kit does not ship that skill. The rule
    // itself is self-contained and worth having everywhere — a marketing plan
    // asserts facts too — but `workflowLines` already holds the line that a
    // pointer to a file that is not there is worse than no pointer, and the
    // marketing kit ships no `skills/software/`. Emitting it unconditionally put
    // a dangling path in every marketing install.
    detail: {
      path: ".claude/skills/software/verify-plan/SKILL.md",
      text: ` Detail: \`.claude/skills/software/verify-plan/SKILL.md\`.`,
    },
  },
];

/** The rules for a project, each citing only paths that actually landed in it. */
function rulesFor(projectRoot) {
  return RULES.map((r) => ({
    key: r.key,
    text: r.detail && fs.existsSync(path.join(projectRoot, r.detail.path))
      ? r.text + r.detail.text
      : r.text,
  }));
}

function section(lines, projectRoot) {
  return [
    `## Workflows`,
    ``,
    MARKER,
    ...lines,
    `- And other workflows: \`./.claude/workflows/*\``,
    ``,
    ...rulesFor(projectRoot).flatMap((r) => [r.text, ``]).slice(0, -1),
  ].join("\n");
}

/**
 * Wire the kit's workflows into the project's CLAUDE.md.
 *
 * created   — no CLAUDE.md existed; wrote a minimal one
 * wired     — appended a §Workflows section to the user's file
 * unchanged — already references .claude/workflows/, or the kit ships none
 *
 * Returns { action, count }.
 */
function wireClaudeMd(projectRoot, kit) {
  const lines = workflowLines(projectRoot, kit);
  if (!lines.length) return { action: "unchanged", count: 0 };

  const file = path.join(projectRoot, "CLAUDE.md");

  if (!fs.existsSync(file)) {
    const body = [
      `# CLAUDE.md`,
      ``,
      `Project instructions for Claude Code. Generated by \`ck init\` — run \`/ck:claude-md init\` to expand this into a full project file (build commands, architecture, constraints).`,
      ``,
      section(lines, projectRoot),
      ``,
    ].join("\n");
    fs.writeFileSync(file, body);
    return { action: "created", count: lines.length };
  }

  const existing = fs.readFileSync(file, "utf-8");
  const sep0 = existing.endsWith("\n") ? "\n" : "\n\n";
  const missingRules = rulesFor(projectRoot).filter((r) => !existing.includes(r.key)).map((r) => r.text);

  // A previous `ck init` wrote this section. "Already wired" was treated as
  // "nothing to add", and that conflation meant a later version's workflows and
  // rules reached brand-new installs only: re-running `ck init` on an existing
  // project returned `unchanged` and the refuted-premise hard stop — the one
  // rule a positive control proved necessary — never arrived for any existing
  // user. Ensure what this version generates is present; never rewrite a line.
  if (existing.includes(MARKER)) {
    const missingLines = lines.filter((l) => !existing.includes(l));
    if (!missingLines.length && !missingRules.length) return { action: "unchanged", count: 0 };
    let next = existing;
    // Pointers belong inside the section, directly after the marker that owns it.
    if (missingLines.length) next = next.replace(MARKER, [MARKER, ...missingLines].join("\n"));
    // Rules are self-contained paragraphs, so appending keeps the bullet list
    // intact and cannot land in the middle of anything the user wrote.
    if (missingRules.length) next = next + (next.endsWith("\n") ? "\n" : "\n\n") + missingRules.join("\n\n") + "\n";
    fs.writeFileSync(file, next);
    return { action: "updated", count: missingLines.length + missingRules.length };
  }

  // Wired by the user in their own words, with no marker of ours anywhere. Their
  // file is left byte-identical: we did not write it and we do not edit it.
  //
  // That is a real cost, not a free win — an operative rule cannot be delivered
  // by the link they wrote, because the rule exists precisely for runs that open
  // no linked file. So the gap is reported instead of silently accepted or
  // silently closed: the choice of what goes in their own CLAUDE.md is theirs.
  if (existing.includes(".claude/workflows/")) {
    if (!missingRules.length) return { action: "unchanged", count: 0 };
    return { action: "unchanged", count: 0, missingRules };
  }

  const sep = sep0;
  fs.writeFileSync(file, existing + sep + section(lines, projectRoot) + "\n");
  return { action: "wired", count: lines.length };
}

module.exports = { wireClaudeMd, MARKER, labelFor };
