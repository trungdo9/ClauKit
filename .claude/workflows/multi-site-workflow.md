# Multi-Site Enterprise Architecture Workflow (5-phase)

Hub-and-Spoke multi-site governance and content syndication pipeline for multi-brand and multi-domain enterprises.

**Trigger:** Multi-site content rollout, new tenant onboarding, or cross-domain SEO syndication
**Agent:** `content-strategist`, `campaign-manager`, `seo-content`
**Required input:** `plans/multi-site-enterprise-architecture.md` (or enterprise config)
**Output dir:** `sites/<domain>/` and `shared/`

---

## Phase 0 — Architecture & Tenant Gate

Verify workspace topology follows the Hub-and-Spoke structure:
- `shared/` (or `wiki/knowledge/`, `wiki/media/`, `wiki/resources/`): Core truth (specs, media, certifications, CRM).
- `sites/<domain>/`: Tenant spokes (config, site-specific keywords, local wiki/drafts).
- `social/`: Cross-channel social ecosystem.

Ensure target site credentials exist in `.claude/.env` with site prefix (e.g. `SITE_<SLUG>_DOMAIN`).

## Phase 1 — Intent Partitioning & Anti-Cannibalization Check

For any new campaign, product, or article topic:
1. Map topic against each site's primary intent:
   - **Site A (Transactional/Wholesale):** Commercial intent, bulk pricing, specs, inventory.
   - **Site B (Services/EPC/Solutions):** Informational intent, system design, case studies, compliance.
   - **Site C (Niche/Distribution):** Multi-product selection, sizing calculations, trade resale.
2. Verify zero keyword cannibalization across tenant keyword maps.
*Output:* `intent-allocation.md` (Target keywords, unique angles, canonical paths).

## Phase 2 — Core Asset Grounding

Pull shared technical facts from the central knowledge base:
- Chemical/physical parameters, standard test methods (ASTM, ISO, national standards).
- Official certifications (lab test reports, CO/CQ, MSDS).
- Verified assets from the central Media Lake.
*Output:* `grounding-bundle.md` (Verified claims, media URLs, specification tables).

## Phase 3 — Distinct Tenant Content Generation (parallel)

Generate distinct, non-duplicate content assets customized for each tenant:
- **Tenant 1:** Commercial focus, price tiers, ordering procedures, warehouse stock.
- **Tenant 2:** Engineering depth, process flow diagrams, maintenance procedures, tender specs.
- **Tenant 3:** Technical configuration, multi-layer sizing, equipment compatibility.
*Output:* Markdown drafts in `sites/<domain>/wiki/drafts/<slug>.md`.

## Phase 4 — Semantic Interlinking & Schema Calibration

1. Establish semantic cross-domain references (e.g. service site linking to material warehouse for supply; material site linking to engineering site for turn-key contracting).
2. Validate Schema markup per domain (Organization, WebSite, Product, Article, FAQPage).
*Output:* `cross-site-links.md` (Link audit and canonical verification).

## Phase 5 — Gated Multi-Tenant Publishing

Publish to each site independently using tenant-specific CLI flags:
```bash
# Example tenant-specific deployment
node scripts/publish-post.js sites/site-a/wiki/drafts/slug.md --site=site-a --publish
node scripts/publish-post.js sites/site-b/wiki/drafts/slug.md --site=site-b --publish
```
- Verify HTTP 200 on live URLs.
- Submit each URL to Instant Indexing API per domain.
*Output:* `multi-site-publish-log.md`.

---

**Rules:**
1. **Zero Duplicate Content:** Never copy-paste text between tenant sites. Each site must provide a distinct angle and value proposition.
2. **Strict Folder Boundaries:** Tenant content and config must remain strictly inside `sites/<domain>/`.
3. **Single Source of Truth:** Technical truth lives in `shared/` — update once, inherit everywhere.
