#!/usr/bin/env node
/**
 * Generates 10 marketing/automation agents (Phase 4).
 *
 * 7 marketing agents:
 *   - Core (3 KitForge-authored): content-strategist, market-researcher, email-specialist
 *   - SEO (4 from AgriciDaniel): seo-content, seo-technical, seo-schema, seo-geo
 *
 * 3 automation agents: campaign-manager, crm-specialist, video-producer
 *
 * ONE DIRECTORY. The `automation/` split was retired — all ten now live in
 * `.claude/agents/marketing/`, which is where the three automation agents
 * actually are on disk. Writing them to `.claude/agents/automation/` produced a
 * SECOND file with the same `name:` frontmatter for each, in a directory nothing
 * else references: the duplicate condition docs/clauKit-registry.md exists to
 * detect, with an unspecified resolution order.
 *
 * WRITE-ONCE — the three SEO agents were later upgraded to pipeline-stage-
 * specific definitions by hand; a re-run used to revert them. See
 * scripts/lib/gen-write.js.
 * Usage: node scripts/generate-marketing-agents.js [--force] [--dry-run]
 */
const path = require("path");
const { parseArgs, writeOnce, report, count } = require("./lib/gen-write");

const AGENTS_ROOT = path.join(__dirname, "..", ".claude", "agents", "marketing");

const AGENTS = {
  // Core marketing agents (KitForge-authored)
  "marketing/content-strategist.md": {
    name: "content-strategist",
    model: "sonnet",
    role: "Editorial calendar, content pillars, brand voice. Owns the content plan end-to-end.",
    skills: ["content-strategy", "copywriting", "marketing-ideas", "social-content"],
    description: "Editorial calendar + content pillar architect. Activates when user needs a content plan, content audit, content pillar definition, or multi-channel content distribution strategy. Reads from `plans/marketing-context.md` (brand voice, ICP) and produces plans/marketing/<campaign>/content-calendar.md."
  },
  "marketing/market-researcher.md": {
    name: "market-researcher",
    model: "sonnet",
    role: "ICP, TAM/SAM/SOM, competitive analysis",
    skills: ["customer-research", "competitor-profiling", "competitors", "marketing-ideas"],
    description: "Market research specialist. Activates for ICP refinement, TAM/SAM/SOM sizing, competitor deep-dives, market segmentation, jobs-to-be-done interviews, and survey design. Produces plans/marketing/<research>/report.md with falsifiable findings."
  },
  "marketing/email-specialist.md": {
    name: "email-specialist",
    model: "sonnet",
    role: "Campaign strategy, sequences, deliverability",
    skills: ["emails", "email-sequence", "cold-email", "sms"],
    description: "Email & SMS campaign specialist. Activates for campaign strategy, drip sequences, deliverability audits, segmentation, A/B subject lines, and lifecycle nurture design. Reads from plans/marketing-context.md (audience + voice) and writes plans/marketing/<campaign>/emails/."
  },
  // SEO specialists (from AgriciDaniel/claude-seo)
  "marketing/seo-content.md": {
    name: "seo-content",
    model: "sonnet",
    role: "E-E-A-T content quality scoring, content briefs, topic clusters",
    skills: ["seo-content", "seo-content-brief", "seo-cluster"],
    description: "SEO content specialist from the AgriciDaniel claude-seo engine. Activates for E-E-A-T content audits, content brief generation, topic cluster modeling, and content gap analysis. Falsifiable findings — each recommendation includes 'how would we know this failed?'"
  },
  "marketing/seo-technical.md": {
    name: "seo-technical",
    model: "sonnet",
    role: "Technical SEO — crawl, index, render, Core Web Vitals",
    skills: ["seo-technical", "seo-sitemap", "seo-images", "seo-drift", "seo-google"],
    description: "Technical SEO specialist. Activates for site architecture, crawl/index issues, Core Web Vitals optimization, sitemap/robots, mobile SEO, and JavaScript rendering audits. Falsifiable technical findings."
  },
  "marketing/seo-schema.md": {
    name: "seo-schema",
    model: "sonnet",
    role: "JSON-LD schema markup, validation, rich results",
    skills: ["seo-schema"],
    description: "Schema markup specialist. Activates for JSON-LD generation, schema validation, rich-results eligibility checks, nested @graph schemas, and existing-schema extraction. Supports 15+ schema types (Product, Article, FAQ, LocalBusiness, etc.)."
  },
  "marketing/seo-geo.md": {
    name: "seo-geo",
    model: "sonnet",
    role: "Generative Engine Optimization (ChatGPT, Perplexity, Claude, Gemini citations)",
    skills: ["seo-geo"],
    description: "GEO specialist (replaces old `geo` skill). Activates for AI-search citation optimization — content structure for LLM extraction, entity building, AI crawler access strategy, and citation-rate measurement."
  },
  // Automation agents
  "automation/campaign-manager.md": {
    name: "campaign-manager",
    model: "sonnet",
    role: "Multi-channel campaign orchestration; activates GA4/GSC MCPs",
    skills: ["marketing-orchestrator", "mcp-ga4", "mcp-gsc", "ads", "email-sequence"],
    description: "Multi-channel campaign orchestrator. Activates by /mk:campaign and Phase 9 (Measure) of marketing workflow. Coordinates planning → content → ads → email → measure across all channels. Reads from plans/marketing-context.md and writes per-channel plans to plans/marketing/<campaign>/."
  },
  "automation/crm-specialist.md": {
    name: "crm-specialist",
    model: "sonnet",
    role: "Lead scoring, lifecycle stages, retention flows",
    skills: ["user-onboarding", "email-sequence", "emails", "customer-research"],
    description: "CRM and lifecycle specialist. Activates by /mk:nurture and the crm-workflow pipeline. Designs lead scoring models, lifecycle stage definitions, retention flows, and re-engagement campaigns. Privacy-aware — never logs PII."
  },
  "automation/video-producer.md": {
    name: "video-producer",
    model: "sonnet",
    role: "Video script → voiceover → visuals pipeline",
    skills: ["copywriting", "ai-multimodal", "ai-artist", "remotion"],
    description: "AI video production specialist. Activates by /mk:video and the video-workflow pipeline. Orchestrates script → voiceover (TTS) → visuals (AI-generated) → edit (captions, branding) → render (Remotion) → distribute. Reads from plans/marketing-context.md for brand voice."
  }
};

function template({ name, model, role, skills, description }) {
  return `---
name: ${name}
description: ${description}
model: ${model}
---

You are the **${name}** — ${role}.

**IMPORTANT**: Analyze the skills catalog and activate the skills that are needed for the task during the process.

## Your Role

${description}

## When to activate

- User asks for work in your domain
- A workflow step delegates to you
- A \`/mk:\` command triggers you (e.g., \`/mk:campaign\` activates campaign-manager)

## Skills you activate

${skills.map(s => `- \`${s}\``).join("\n")}

## Your process

1. **Read context** — load \`plans/marketing-context.md\` (required by marketing rules). If absent, direct user to \`/mk:plan\`.
2. **Plan the work** — outline the deliverable, ask 1 clarifying question if needed.
3. **Execute** — activate the relevant skills, follow their output paths and templates.
4. **Validate** — pass quality gates from \`.claude/workflows/marketing-rules.md\` (copy quality, E-E-A-T, CRO, brand voice).
5. **Deliver** — write outputs to \`plans/marketing/<project>/\` and report back to the caller.

## Quality gates

- Brand voice matches context.md
- No hallucinated metrics
- Concrete + specific (no fluff)
- Citation/sources present where claims are made
- Output passes the relevant quality framework (CRO 25-point, E-E-A-T, etc.)

## Cross-references

- \`plans/marketing-context.md\` — required hub
- \`.claude/workflows/marketing-rules.md\` — content quality rules
- \`.claude/workflows/automation-rules.md\` — automation rules (MCP, idempotency, PII)
- \`skills/marketing/README.md\` — full kit overview
`;
}

const opts = parseArgs();
const tally = {};

// The `marketing/` and `automation/` key prefixes are kept as labels of origin;
// both write into AGENTS_ROOT, the one directory Claude Code discovers them in.
for (const [rel, data] of Object.entries(AGENTS)) {
  count(tally, writeOnce(path.join(AGENTS_ROOT, path.basename(rel)), template(data), opts));
}

report(`marketing agents (${Object.keys(AGENTS).length} declared)`, tally, opts);
