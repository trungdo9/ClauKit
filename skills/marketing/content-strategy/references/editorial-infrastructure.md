# Editorial Infrastructure

Where the calendar meets the CMS: content modeling, the draft→publish workflow, and platform selection. Use when standing up a new marketing site, restructuring an existing content library, or wiring the calendar to a publishing system.

## Headless vs traditional

A headless CMS separates content management from presentation — content lives structured in a backend and is delivered by API to any frontend.

**Headless fits when:** multiple frontends consume the same content (web, mobile, email); developers want full control of the stack; content is reused across channels; the site is built on a modern framework; marketing needs structured, reusable blocks.

**Traditional fits when:** the team has no dedicated developers; it is a simple blog or brochure site; WYSIWYG editing is a hard requirement; budget is tight and WordPress or Webflow does the job.

| Factor | Headless | Traditional |
|---|---|---|
| Multi-channel delivery | Yes | Limited |
| Developer control | Full | Constrained |
| Non-technical editing | Requires setup | Built in |
| Time to launch | Longer | Faster |
| Content reuse | Native | Manual |
| Hosting flexibility | Any frontend | Platform-dependent |

ClauKit ships a WordPress publishing path (`.claude/skills/integrations/wordpress-rest/SKILL.md`, used by `/mk:content publish`), which is the traditional-CMS lane. Anything headless is a build decision the team makes outside the kit.

## Content modeling for marketing

**Principles**
1. **Think in types, not pages.** A "Landing Page" is a content type with fields, not an HTML file. Components then get reused across pages.
2. **Separate content from presentation.** Store the headline text, not the styled headline.
3. **Design for reuse.** If testimonials appear on five pages, create a Testimonial type and reference it.
4. **Keep models flat.** Deeply nested structures are hard to query and maintain — prefer references over nesting.

**Common marketing types**

| Type | Key fields | Notes |
|---|---|---|
| **Landing Page** | title, slug, hero, sections[], seo | Modular sections for flexibility |
| **Blog Post** | title, slug, body, author, category, tags, publishedAt, seo | Rich-text body |
| **Case Study** | title, customer, challenge, solution, results, metrics[], logo | Link to related products/features |
| **Testimonial** | quote, author, role, company, avatar, rating | Referenced from landing pages |
| **FAQ** | question, answer, category | Group by category for programmatic pages |
| **Author** | name, bio, avatar, social links | Referenced from blog posts; carries E-E-A-T signals |
| **CTA Block** | heading, body, buttonText, buttonUrl, variant | Reusable across pages |

**SEO fields every page-level type needs:** `metaTitle` (50–60 chars), `metaDescription` (150–160 chars), `ogImage` (1200x630), `slug`, `canonicalUrl` (optional override), `noIndex` (boolean), `structuredData` (optional JSON-LD override — generation is [[seo-schema]]'s job).

## Editorial workflow

**Draft → Review → Approve → Schedule → Publish.** Review covers accuracy, brand voice against `plans/marketing-context.md`, and on-page SEO. Approval is a named person, not a vibe. Scheduling is what turns a calendar row into a shipped piece.

**Preview.** Every major headless platform supports draft previews (Sanity's Presentation tool, Contentful's Preview API, Strapi's Draft & Publish). Set up an authenticated preview route in the frontend so reviewers see draft content in situ.

**Roles.** Exact models vary by platform, but the shape is consistent:

| Role | Create | Edit | Publish | Delete |
|---|:---:|:---:|:---:|:---:|
| Author | Yes | Own | No | Own drafts |
| Editor | Yes | All | Yes | Drafts |
| Admin | Yes | All | Yes | All |

## Platform comparison

| Feature | Sanity | Contentful | Strapi |
|---|---|---|---|
| Hosting | Cloud (managed) | Cloud (managed) | Self-hosted or cloud |
| Query | GROQ | REST / GraphQL | REST / GraphQL |
| Free tier | Generous | Limited | Open source |
| Real-time collab | Built in | Limited | No |
| Content modeling | Schema-as-code | Web UI | Web UI or code |
| Best for | Developer flexibility | Enterprise multi-locale | Budget / self-hosted |

- **Sanity** — powerful GROQ queries, schema in version-controlled code, real-time collaborative editing. Steeper curve for non-developers; Studio customization needs React. Best when developers and marketers work closely on content-heavy sites.
- **Contentful** — mature, strong multi-locale, large integration ecosystem. Pricing scales with content types and locales; two separate APIs (Delivery and Management); tight rate limits on lower plans. Best for enterprises with multi-market needs.
- **Strapi** — open source and self-hostable, full data control, no per-seat pricing, customizable admin. You own the infrastructure; smaller ecosystem; v4→v5 migration is non-trivial. Best for teams with DevOps capacity who want no vendor lock-in.
- **Also worth knowing** — Hygraph (GraphQL-native, content federation), Keystatic (Git-based), Payload (TypeScript-first, self-hosted), Builder.io (visual editing over a headless backend), Prismic (slice-based modeling).

## Where this connects

- **Programmatic pages** — the CMS is the data source; store FAQs, comparisons, and location data as types and generate pages from queries. See [[seo-programmatic]].
- **Copy structure** — model fields to match the copy frameworks in use (headline, subheadline, social proof, CTA) so structure is enforced at entry. See [[copywriting]].
- **Email** — pull CMS content (case studies, testimonials, posts) into templates so web and email stay consistent. See [[emails]], [[email-sequence]].
- **Publishing** — `/mk:content publish` pushes to WordPress draft-first and upserts by slug. See `.claude/skills/integrations/wordpress-rest/SKILL.md`.

## Implementation checklist

- [ ] Define content types from page types and reusable blocks
- [ ] Add the SEO field set to every page-level type
- [ ] Set up preview / draft mode in the frontend
- [ ] Configure roles and permissions
- [ ] Create sample content for each type before building the frontend
- [ ] Set up webhooks for content changes (rebuild triggers)
- [ ] Document field guidelines for editors (descriptions, character limits)
- [ ] Test delivery performance (CDN, caching, incremental regeneration)
- [ ] Plan the migration path if replacing an existing CMS

Provenance: adapted from `coreyhaines31/marketingskills` (`content-strategy/references/headless-cms.md`), MIT, (c) 2025 Corey Haines. Upstream links to per-vendor integration guides dropped (not present in ClauKit); WordPress path added.
