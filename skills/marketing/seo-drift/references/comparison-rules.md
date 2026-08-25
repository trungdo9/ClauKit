# SEO Drift Comparison Rules

17 rules across 3 severity levels. Each rule compares a specific SEO element
between the stored baseline and the current page state.

---

## CRITICAL (Immediate Action Required)

These changes typically cause measurable traffic loss within days.

### Rule 1: Schema/JSON-LD Completely Removed
- **Compare**: Baseline `schema` array has items, current is empty
- **Threshold**: Any schema present before, none now
- **Action**: Restore structured data immediately. Eligible rich results (Product, Review, LocalBusiness, and similar supported types) can drop from SERPs quickly; retired types (FAQ, HowTo) should not be treated as rich-result losses.
- **Route to**: [[seo-schema]]

### Rule 2: Canonical URL Changed
- **Compare**: Baseline `canonical` vs current `canonical`
- **Threshold**: Different non-null values (after URL normalization)
- **Action**: Verify the new canonical is intentional. Incorrect canonicals redirect ranking signals to the wrong page.
- **Route to**: [[seo-technical]]

### Rule 3: Canonical URL Removed
- **Compare**: Baseline `canonical` was set, current is null
- **Threshold**: Had a value, now missing
- **Action**: Restore the canonical tag. Google will guess, often incorrectly for pages with query parameters.
- **Route to**: [[seo-technical]]

### Rule 4: Noindex Directive Added
- **Compare**: Baseline `meta_robots` did not contain "noindex", current does
- **Threshold**: "noindex" substring now present (case-insensitive)
- **Action**: If unintentional, remove immediately. The page will drop from the index within days.
- **Route to**: [[seo-technical]]

### Rule 5: H1 Tag Removed Entirely
- **Compare**: Baseline `h1` had entries, current is empty
- **Threshold**: One or more H1s before, zero now
- **Action**: Restore the H1 heading — it's the primary page-topic signal for search engines.
- **Route to**: [[seo-content]]

### Rule 6: H1 Text Changed Significantly
- **Compare**: First H1 in baseline vs first H1 in current, string-similarity ratio
- **Threshold**: Similarity ratio < 0.5 (more than 50% different)
- **Action**: Verify the H1 change aligns with the target keyword strategy.
- **Route to**: [[seo-content]]

### Rule 7: Title Tag Removed Entirely
- **Compare**: Baseline `title` was set, current is null or empty
- **Threshold**: Had a value, now missing
- **Action**: Restore the title tag immediately. Google will auto-generate one, often poorly.
- **Route to**: [[seo-page]]

### Rule 8: HTTP Status Code Changed to Error
- **Compare**: Baseline `status_code` was 2xx, current is 4xx or 5xx
- **Threshold**: Status class changed from success to client/server error
- **Action**: Investigate the server error or missing page. Rankings will drop within days.
- **Route to**: [[seo-technical]]

---

## WARNING (Investigate Within 1 Week)

These changes may impact rankings or CTR but are sometimes intentional.

### Rule 9: Title Text Changed
- **Compare**: Baseline `title` vs current `title` (trimmed)
- **Threshold**: Strings differ (case-sensitive, whitespace-normalized)
- **Action**: Verify the new title still includes target keywords. Monitor CTR over ~2 weeks.
- **Route to**: [[seo-page]]

### Rule 10: Meta Description Changed
- **Compare**: Baseline `meta_description` vs current `meta_description`
- **Threshold**: Strings differ (trimmed)
- **Action**: Verify the new description keeps a call-to-action and target keywords. Monitor CTR.
- **Route to**: [[seo-page]]

### Rule 11: Core Web Vitals Metric Regressed >20%
- **Compare**: Each CWV metric's p75 value (LCP, INP, CLS), baseline vs current
- **Threshold**: Current value is more than 20% worse than baseline
- **Action**: Investigate the performance regression — check recent code changes or third-party scripts.
- **Route to**: [[seo-technical]]

### Rule 12: Lighthouse Performance Score Dropped 10+ Points
- **Compare**: Lighthouse performance score, baseline vs current
- **Threshold**: Drop of 10 or more points (e.g., 85 → 74)
- **Action**: Run a full PageSpeed analysis to identify the new bottleneck.
- **Route to**: [[seo-technical]]

### Rule 13: OG Tags Removed
- **Compare**: Baseline `open_graph` had entries, current is empty
- **Threshold**: One or more OG tags before, none now
- **Action**: Restore OG tags — social sharing will otherwise show a generic or missing preview.
- **Route to**: [[seo-page]]

### Rule 14: Schema/JSON-LD Content Modified
- **Compare**: Baseline `schema_hash` vs current `schema_hash`
- **Threshold**: Hash differs AND schema still exists (removal is Rule 1)
- **Action**: Validate the modified schema — check for type changes, removed properties, or new validation errors.
- **Route to**: [[seo-schema]]

---

## INFO (Awareness Only)

These are tracked for completeness. Often neutral or positive changes.

### Rule 15: New Schema/JSON-LD Added
- **Compare**: Baseline `schema` was empty, current has items
- **Threshold**: No schema before, schema now present
- **Action**: Positive change — validate the new schema.
- **Route to**: [[seo-schema]]

### Rule 16: H2 Structure Changed
- **Compare**: Baseline `h2` array vs current `h2` array
- **Threshold**: Different number of H2s, or different H2 text values
- **Action**: Review the heading hierarchy — confirm content sections still align with target topics.
- **Route to**: [[seo-content]]

### Rule 17: Content Hash Changed
- **Compare**: Baseline `html_hash` vs current `html_hash`
- **Threshold**: Hash differs (catch-all for any body content change)
- **Action**: General content change detected. Review this one if no other rule triggered, to understand what changed.
- **Route to**: [[seo-page]]
