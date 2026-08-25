/**
 * marketing-commands.js — the /mk: command declarations, data only.
 *
 * Extracted from generate-marketing-commands.js so that generator stays under
 * the repo's 200-line file budget (.claude/workflows/development-rules.md): the
 * table is 135 of its lines and never changes when the template does.
 */

const COMMANDS = {
  "plan.md": {
    desc: "Marketing plan — bootstrap or update plans/marketing-context.md (ICP, positioning, voice)",
    hint: "[fast|full]",
    actions: [
      { name: "fast", what: "Skip interview, scaffold context from existing docs (README, docs/)", skills: ["product-marketing"] },
      { name: "full", what: "Full interview mode (default) — 8 questions, one at a time", skills: ["product-marketing", "customer-research"] }
    ],
    activate: "Activate the `product-marketing` skill (skills/marketing/product-marketing/SKILL.md). It is the hub for marketing context.",
    output: "plans/marketing-context.md"
  },
  "seo.md": {
    desc: "SEO operations — routes through AgriciDaniel/claude-seo engine (25 sub-skills + 18 agents in parallel)",
    hint: "audit|keywords|ai|programmatic|schema <target>",
    actions: [
      { name: "audit", what: "Full SEO audit (technical + content + backlinks + schema)", skills: ["seo-audit", "seo-technical", "seo-content", "seo-schema"] },
      { name: "keywords", what: "Keyword research with SERP analysis + content brief", skills: ["seo-content-brief", "seo-cluster"] },
      { name: "ai", what: "AI-search optimization (GEO — ChatGPT, Perplexity, Claude citations)", skills: ["seo-geo"] },
      // `programmatic-seo` was removed as a duplicate of `seo-programmatic`
      // (registry §4f) — naming it here re-published a link to a missing skill.
      { name: "programmatic", what: "Programmatic SEO — template pages at scale", skills: ["seo-programmatic"] },
      { name: "schema", what: "JSON-LD schema generation + validation", skills: ["seo-schema"] }
    ],
    activate: "Activate the `seo` skill (skills/marketing/seo/SKILL.md) — the claude-seo orchestrator. It dispatches the 24 sub-skills in parallel based on industry detection.",
    output: "plans/marketing/<target>/seo-<action>-report.md"
  },
  "content.md": {
    desc: "Content creation — blog posts, social, video scripts, copy",
    hint: "blog|social|video|copy <topic>",
    actions: [
      { name: "blog", what: "SEO-optimized long-form blog post (E-E-A-T compliant)", skills: ["copywriting", "seo-content", "copy-editing"] },
      { name: "social", what: "Multi-platform social content (Twitter, LinkedIn, Instagram)", skills: ["social-content", "copywriting"] },
      { name: "video", what: "Video script (hook + body + CTA) for short-form or long-form", skills: ["copywriting", "video-producer"] },
      { name: "copy", what: "Conversion copy — landing pages, ads, CTAs", skills: ["copywriting", "cro"] }
    ],
    activate: "Activate content-strategist agent + the action-specific skills.",
    output: "plans/marketing/<campaign>/content/<asset>.<ext>"
  },
  "email.md": {
    desc: "Email & SMS campaigns — campaign strategy, cold outreach, drip sequences, SMS",
    hint: "campaign|cold|drip|sms <goal>",
    actions: [
      { name: "campaign", what: "One-shot email campaign (announcement, launch, promo)", skills: ["emails", "copywriting"] },
      { name: "cold", what: "Cold outreach sequence (3-7 emails, personalization, follow-up)", skills: ["cold-email"] },
      { name: "drip", what: "Lifecycle drip sequence (onboarding, education, conversion)", skills: ["email-sequence", "user-onboarding"] },
      { name: "sms", what: "SMS marketing campaign (compliance + segmentation + cadence)", skills: ["sms"] }
    ],
    activate: "Activate email-specialist agent + the action-specific skills.",
    output: "plans/marketing/<campaign>/emails/<sequence>.md"
  },
  "ads.md": {
    desc: "Paid advertising — Google Ads, Meta Ads, ad creative, A/B testing",
    hint: "google|meta|creative|ab-test <goal>",
    actions: [
      { name: "google", what: "Google Ads structure (Search, Display, PMax) + bidding strategy", skills: ["ads", "ad-creative"] },
      { name: "meta", what: "Meta Ads (Facebook + Instagram) — targeting + creative variants", skills: ["ads", "ad-creative"] },
      { name: "creative", what: "Ad creative — headlines, copy, image briefs, video scripts", skills: ["ad-creative", "copywriting"] },
      { name: "ab-test", what: "A/B test design for ads — hypothesis + variants + measurement", skills: ["ads", "cro"] }
    ],
    activate: "Activate content-strategist + ads skills.",
    output: "plans/marketing/<campaign>/ads/<platform>.md"
  },
  "cro.md": {
    desc: "Conversion Rate Optimization — audit, landing pages, signup, email",
    hint: "audit|landing|signup|email <target>",
    actions: [
      { name: "audit", what: "Full CRO audit using 25-point framework (see .claude/workflows/cro-framework.md)", skills: ["cro"] },
      { name: "landing", what: "Landing page optimization — value prop, CTAs, social proof", skills: ["cro", "copywriting", "signup"] },
      { name: "signup", what: "Signup flow optimization — friction reduction, form design", skills: ["signup", "cro"] },
      { name: "email", what: "Email conversion — subject lines, CTAs, click-through", skills: ["emails", "cro"] }
    ],
    activate: "Activate copywriter + cro skills. Reference .claude/workflows/cro-framework.md (25 points).",
    output: "plans/marketing/<target>/cro-<action>-report.md"
  },
  "research.md": {
    desc: "Market research — market sizing, competitors, customer interviews, ICP refinement",
    hint: "market|competitor|customer|icp <topic>",
    actions: [
      { name: "market", what: "Market sizing (TAM/SAM/SOM) + trends", skills: ["market-sizing", "customer-research", "marketing-ideas"] },
      { name: "competitor", what: "Competitor deep-dive (positioning, pricing, channels, weaknesses)", skills: ["competitor-profiling", "competitors", "competitor-alternatives"] },
      { name: "customer", what: "Customer research (interviews, surveys, jobs-to-be-done)", skills: ["customer-research"] },
      { name: "icp", what: "ICP refinement + persona synthesis", skills: ["customer-research", "product-marketing"] }
    ],
    activate: "Activate market-researcher agent + action-specific skills.",
    output: "plans/marketing/<research>/report.md"
  },
  "growth.md": {
    desc: "Growth tactics — product launches, referral programs, free tools, community",
    hint: "launch|referral|free-tool <goal>",
    actions: [
      { name: "launch", what: "Product launch playbook (pre-launch, launch day, post-launch)", skills: ["launch", "copywriting", "ads"] },
      { name: "referral", what: "Referral program design (incentives, sharing mechanics, tracking)", skills: ["marketing-ideas", "analytics"] },
      { name: "free-tool", what: "Free tool / lead magnet strategy (build, distribute, convert)", skills: ["marketing-ideas", "content-strategy"] }
    ],
    activate: "Activate content-strategist + action-specific skills.",
    output: "plans/marketing/<campaign>/growth-<tactic>.md"
  },
  // Automation commands (workflow entry points)
  "campaign.md": {
    desc: "Run a full marketing campaign (10-phase pipeline — plan → research → insights → strategy → plan → create → edit → publish → promote → measure → optimize loop)",
    hint: "<campaign-name>",
    actions: [
      { name: "default", what: "Full 10-phase marketing workflow", skills: ["marketing-orchestrator", "campaign-manager", "content-strategy", "ads", "email-sequence", "seo-content", "analytics"] }
    ],
    activate: "Activate campaign-manager agent. Execute .claude/workflows/marketing-workflow.md (10 phases). Confirm with user before each phase transition. Loop Optimize → Strategy as needed.",
    output: "plans/marketing/<campaign-name>/"
  },
  "leads.md": {
    desc: "Lead generation pipeline (5-phase — generate → qualify → nurture → convert → retain)",
    hint: "<icp-description>",
    actions: [
      { name: "default", what: "Full 5-phase lead pipeline", skills: ["cold-email", "email-specialist", "crm-specialist", "customer-research"] }
    ],
    activate: "Activate email-specialist + crm-specialist agents. Execute .claude/workflows/sales-workflow.md (5 phases). PII redaction enforced.",
    output: "plans/marketing/<campaign>/leads.csv (PII-redacted)"
  },
  "nurture.md": {
    desc: "Lifecycle nurture sequence based on lead stage (5-phase — calendar → forms → tasks → gmail → bigquery)",
    hint: "<lead-stage>",
    actions: [
      { name: "default", what: "5-phase lifecycle automation", skills: ["crm-specialist", "email-specialist", "user-onboarding"] }
    ],
    activate: "Activate crm-specialist agent. Execute .claude/workflows/crm-workflow.md (5 phases). Idempotency required.",
    output: "plans/marketing/<campaign>/nurture/<sequence>.md"
  },
  "video.md": {
    desc: "AI video production (6-phase — script → voiceover → visuals → edit → render → distribute)",
    hint: "<video-concept>",
    actions: [
      { name: "default", what: "6-phase AI video pipeline", skills: ["video-producer", "copywriting", "ai-multimodal", "ai-artist", "remotion"] }
    ],
    activate: "Activate video-producer agent. Execute .claude/workflows/video-workflow.md (6 phases).",
    output: "plans/marketing/<campaign>/video/<asset>.<ext>"
  }
};

module.exports = { COMMANDS };
