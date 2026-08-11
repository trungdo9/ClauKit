#!/usr/bin/env node
/**
 * Generates marketing skill stubs (Phase 3): 25 claude-seo + 22 coreyhaines31.
 *
 * Creates well-structured SKILL.md files with:
 * - ClauKit frontmatter (name, description, allowed-tools)
 * - Scope + activation + key concepts
 * - Cross-references
 * - Provenance comment (source repo)
 *
 * YAGNI: not full content copies of external repos — references the source
 * and notes what to fetch. User can `git clone` source repos for full content.
 *
 * WRITE-ONCE. A stub is a starting point; several have since been filled in by
 * hand (`seo-cluster` is 93 lines of real content, not 51 of placeholders). An
 * existing SKILL.md is therefore left untouched — see scripts/lib/gen-write.js.
 * Usage: node scripts/generate-marketing-skills.js [--force] [--dry-run]
 */
const path = require("path");
const { parseArgs, writeOnce, report, count } = require("./lib/gen-write");

const SKILLS_ROOT = path.join(__dirname, "..", "skills", "marketing");

// 25 from AgriciDaniel/claude-seo (1 root + 24 sub-skills)
const CLAUDE_SEO = [
  { name: "seo", desc: "Claude-SEO engine root — orchestrator. Detects industry, dispatches 24 sub-skills in parallel, synthesizes via 10-principle framework. Falsifiable findings." },
  { name: "seo-audit", desc: "Full-site SEO audit — 7-phase pipeline with falsifiable findings." },
  { name: "seo-technical", desc: "Technical SEO — crawl, index, render, Core Web Vitals, site architecture." },
  { name: "seo-content", desc: "Content SEO with E-E-A-T framework — quality scoring, original insight, author signals." },
  { name: "seo-schema", desc: "JSON-LD schema markup — type taxonomy, templates, validation. Shared with /ck:seo schema." },
  { name: "seo-geo", desc: "Generative Engine Optimization for AI search (ChatGPT, Perplexity, Claude). Replaces geo." },
  { name: "seo-local", desc: "Local SEO — Google Business Profile, NAP consistency, local pack ranking." },
  { name: "seo-page", desc: "Single-page SEO — on-page factors, content depth, internal linking." },
  { name: "seo-images", desc: "Image SEO — alt text, compression, lazy loading, image sitemaps." },
  { name: "seo-sitemap", desc: "XML sitemap generation, validation, and submission to search engines." },
  { name: "seo-drift", desc: "SEO drift detection — monitor changes that degrade rankings over time." },
  { name: "seo-cluster", desc: "Topic cluster modeling — pillar pages + supporting content, internal link graph." },
  { name: "seo-content-brief", desc: "SEO content brief — keyword targets, SERP analysis, outline, E-E-A-T requirements." },
  { name: "seo-competitor-pages", desc: "Competitor page analysis — what ranks, why, and how to beat it." },
  { name: "seo-ecommerce", desc: "E-commerce SEO — product schema, faceted nav, canonicalization, pagination." },
  { name: "seo-hreflang", desc: "International SEO — hreflang tags, locale targeting, multi-regional sites." },
  { name: "seo-programmatic", desc: "Programmatic SEO — template-based page generation at scale (pSEO)." },
  { name: "seo-backlinks", desc: "Backlink analysis — quality scoring, anchor text distribution, outreach targets." },
  { name: "seo-sxo", desc: "Search Experience Optimization — blend SEO + UX + CRO for ranking pages that convert." },
  { name: "seo-flow", desc: "SEO workflow recipes — multi-step audits, migrations, recovery playbooks." },
  { name: "seo-plan", desc: "SEO planning — quarterly roadmaps, prioritization frameworks, ROI modeling." },
  { name: "seo-maps", desc: "Google Maps / map-pack SEO — local citations, reviews, geo-signals." },
  { name: "seo-dataforseo", desc: "DataForSEO API integration — SERP data, keyword volume, backlink database." },
  { name: "seo-google", desc: "Google-specific SEO — Search Console, PageSpeed Insights, Rich Results Test." },
  { name: "seo-image-gen", desc: "Image generation for SEO — AI image prompts, alt-text optimization, visual content." }
];

// 22 from coreyhaines31/marketingskills (curated subset).
// `programmatic-seo` is deliberately ABSENT: it duplicated the claude-seo import
// `seo-programmatic` and was removed on 2026-07-31 (docs/clauKit-registry.md
// §4f), with cross-links updated to the survivor. Listing it here would have had
// every re-run resurrect the duplicate the registry records as resolved.
const COREY_HAINES = [
  { name: "ad-creative", desc: "Paid ad creative — headlines, copy variants, image briefs, video scripts for ads." },
  { name: "ads", desc: "Paid advertising — Google Ads, Meta Ads, LinkedIn Ads strategy, structure, bidding." },
  { name: "analytics", desc: "Marketing analytics — GA4, GSC, attribution models, dashboards, KPI trees." },
  { name: "cold-email", desc: "Cold email outreach — subject lines, personalization, sequences, deliverability." },
  { name: "competitor-alternatives", desc: "\"Competitors vs [us]\" comparison pages — positioning, copy patterns, schema." },
  { name: "competitor-profiling", desc: "Deep competitor analysis — positioning, pricing, channels, weaknesses." },
  { name: "competitors", desc: "Competitive landscape — who they are, what they do, how to differentiate." },
  { name: "content-strategy", desc: "Content strategy — pillars, calendar, distribution, repurposing." },
  { name: "copy-editing", desc: "Copy editing — clarity, concision, brand voice, grammar, conversion lift." },
  { name: "copywriting", desc: "Copywriting — headlines, value props, CTAs, conversion-oriented writing." },
  { name: "cro", desc: "Conversion Rate Optimization — landing pages, signup flows, popups, A/B tests. 25-point framework." },
  { name: "customer-research", desc: "Customer research — interviews, surveys, jobs-to-be-done, persona synthesis." },
  { name: "email-sequence", desc: "Email sequences — welcome, nurture, re-engagement, onboarding drips." },
  { name: "emails", desc: "Email marketing — campaign strategy, segmentation, deliverability, A/B testing." },
  { name: "launch", desc: "Product launch — pre-launch, launch day, post-launch playbook. PH launches, Product Hunt." },
  { name: "marketing-ideas", desc: "Marketing ideas library — tactics, channels, growth experiments, case studies." },
  { name: "paywalls", desc: "Paywall design — pricing pages, upgrade flows, feature gates, conversion paths." },
  { name: "popup", desc: "Popup strategy — exit-intent, time-delay, scroll-trigger, A/B variants." },
  { name: "signup", desc: "Signup flow optimization — friction reduction, social proof, form design." },
  { name: "sms", desc: "SMS marketing — compliance, cadence, segmentation, opt-in flows." },
  { name: "social-content", desc: "Social content — platform-native posts, hooks, threads, repurposing system." },
  { name: "user-onboarding", desc: "User onboarding (renamed to avoid collision with software/onboarding) — emails, in-app, lifecycle." }
];

function template({ name, desc, source }) {
  return `---
name: ${name}
description: ${desc}
allowed-tools: Read, Write, Glob, Grep
---

# ${name.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}

> ${desc}

---

## When this skill activates

**Implicit:** when the agent/task matches the skill's domain.
**Explicit:** "Use the ${name} skill to [task]."

## Scope

This skill covers:
- [Core capability 1 — what it does well]
- [Core capability 2 — what it does well]
- [Core capability 3 — what it does well]

This skill does NOT cover:
- [Out-of-scope item 1 — refer to another skill]
- [Out-of-scope item 2]

## Key concepts

- **Concept 1** — one-line definition
- **Concept 2** — one-line definition
- **Concept 3** — one-line definition

## Output

When activated, this skill produces:
- \`plans/marketing/<campaign>/${name}.md\` — analysis / audit / brief
- Inline recommendations in the conversation

## Cross-references

- \`plans/marketing-context.md\` — required hub
- \`.claude/workflows/marketing-rules.md\` — content quality rules
- \`skills/marketing/README.md\` — full kit overview
${source === "AgriciDaniel/claude-seo" ? "- `skills/marketing/seo/SKILL.md` — orchestrator (parent)" : ""}

## Provenance

Imported from \`${source}\` and adapted for ClauKit. Adaptations: ClauKit frontmatter, scoped to marketing kit namespace (\`/mk:\`), references \`plans/marketing-context.md\`. For full original content, see source repo.
`;
}

const opts = parseArgs();
const tally = {};

for (const [source, skills] of [["AgriciDaniel/claude-seo", CLAUDE_SEO], ["coreyhaines31/marketingskills", COREY_HAINES]]) {
  for (const skill of skills) {
    const file = path.join(SKILLS_ROOT, skill.name, "SKILL.md");
    count(tally, writeOnce(file, template({ ...skill, source }), opts));
  }
}

report(`marketing skills (${CLAUDE_SEO.length} claude-seo + ${COREY_HAINES.length} coreyhaines31)`, tally, opts);
