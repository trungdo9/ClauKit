/**
 * Converts a scanned `.claude/` tree into Google Antigravity's conventions.
 *
 * Mapping (confirmed against antigravity.google/docs, 2026-08):
 *   .claude/skills/ (all)         -> .agents/skills/ (identical SKILL.md format, verbatim copy)
 *   .claude/agents/ (all *.md)    -> .agents/agents/<name>.md (Antigravity custom agents: same name/description/model
 *                                    frontmatter shape as Claude Code subagents; body compiles to the system prompt)
 *   .claude/commands/ (all *.md)  -> .agents/workflows/<ns>-<name>.md (Antigravity workflows are markdown files with a
 *                                    title/description/steps, invoked via `/workflow-name` — the closest match to a
 *                                    Claude Code slash command)
 *   CLAUDE.md + .claude/workflows -> .agents/rules/*.md (one rule file per source doc; all are under Antigravity's
 *                                    12,000-char-per-rule limit as-is, so no splitting needed)
 *   .claude/mcp.json             -> .agents/mcp_config.json (same {mcpServers: {name: {command,args,env}}} shape)
 *   .claude/hooks/, settings.json -> NOT PORTABLE (no Antigravity equivalent) — reported as a warning, not written
 *
 * Caveat carried over from this repo's own history (see
 * plans/20260604-1747-externalize-skills-symlink/phase-04): a LIVE symlink at
 * `.agent/skills` was tried and retired because Antigravity's IDE has a
 * confirmed bug ignoring symlinked skills (vercel-labs/skills#633). This
 * generator writes real copied files instead, at the now-current `.agents/`
 * (plural) path, so that bug does not apply here.
 */

const path = require("path");
const { rewriteSkillRefs } = require("./link-rewrite");
const { newSummary, writeFileSafe, copyDirSafe } = require("./write-safe");

const DISPLAY_PREFIX = ".agents/skills/";
const HREF_BASE = "../skills/"; // rules/, agents/, workflows/ are all siblings of skills/ under .agents/

function agentMd(agent) {
  const front = [`---`, `name: ${agent.name}`];
  if (agent.data.description) front.push(`description: ${agent.data.description}`);
  if (agent.data.model) front.push(`model: ${agent.data.model} # Claude model name — remap to a Gemini model (e.g. "flash"/"pro") by hand`);
  front.push(`subagent: true`);
  if (agent.data.tools) front.push(`tools: ${agent.data.tools} # Claude Code tool names — verify against Antigravity's tool ids`);
  front.push(`---`, ``);
  const body = rewriteSkillRefs(agent.body, { displayPrefix: DISPLAY_PREFIX, hrefBase: HREF_BASE });
  return [...front, body].join("\n");
}

function commandWorkflowMd(cmd) {
  const lines = [`# /${cmd.ns}-${cmd.name}`, ``];
  if (cmd.data.description) lines.push(cmd.data.description, ``);
  if (cmd.data["argument-hint"]) lines.push(`Arguments: \`${cmd.data["argument-hint"]}\` (Antigravity workflows have no confirmed $ARGUMENTS substitution — treat this as guidance for what to ask the user, not a working placeholder).`, ``);
  const body = rewriteSkillRefs(cmd.body, { displayPrefix: DISPLAY_PREFIX, hrefBase: HREF_BASE });
  lines.push(body);
  return lines.join("\n");
}

function ruleMd(content) {
  return rewriteSkillRefs(content, { displayPrefix: DISPLAY_PREFIX, hrefBase: HREF_BASE });
}

function generate(projectRoot, outRoot, scanned, options = {}) {
  const summary = newSummary();
  const agentsRoot = path.join(outRoot, ".agents");

  copyDirSafe(projectRoot, scanned.skillsSrc, path.join(agentsRoot, "skills"), options, summary);

  if (scanned.claudeMd) {
    writeFileSafe(projectRoot, path.join(agentsRoot, "rules", "claude.md"), ruleMd(scanned.claudeMd), options, summary);
  }
  for (const w of scanned.workflows) {
    writeFileSafe(projectRoot, path.join(agentsRoot, "rules", w.file), ruleMd(w.content), options, summary);
  }

  for (const agent of scanned.agents) {
    writeFileSafe(projectRoot, path.join(agentsRoot, "agents", `${agent.name}.md`), agentMd(agent), options, summary);
  }

  for (const cmd of scanned.commands) {
    writeFileSafe(projectRoot, path.join(agentsRoot, "workflows", `${cmd.ns}-${cmd.name}.md`), commandWorkflowMd(cmd), options, summary);
  }

  if (scanned.mcpServers) {
    writeFileSafe(projectRoot, path.join(agentsRoot, "mcp_config.json"), JSON.stringify({ mcpServers: scanned.mcpServers }, null, 2) + "\n", options, summary);
  }

  summary.warnings.push("hooks/ and settings.json (permissions, statusline) have no Antigravity equivalent — not converted.");
  summary.warnings.push("Rule activation mode (manual / always-on / model-decided / glob) isn't set — Antigravity's exact rule frontmatter for this wasn't confirmed at generation time; review .agents/rules/*.md and set activation by hand if the defaults don't fit.");
  return summary;
}

module.exports = { generate };
