# Alternatives Page Templates

Fill-in section templates for the two alternatives formats. Angle-bracket tokens (`<Competitor>`, `<Your product>`) are slots to replace — never ship them, and never ship a slot you could not fill with a verified fact.

Scope: alternatives pages only. Head-to-head "vs" page templates live in the [[competitors]] skill.

## Contents

- TL;DR summary
- Why people leave (singular) / why people look for alternatives (plural)
- Evaluation-criteria framework (plural only)
- Per-alternative entry (plural only)
- Paragraph comparison
- Pricing comparison
- Who it's for
- Migration / switching
- Switcher social proof
- Comparison table practices
- Centralized competitor data schema
- Alternatives index page
- Footer column

---

## TL;DR summary

Open every alternatives page with this, above the fold:

```markdown
**TL;DR**: <Competitor> is strong at <verified strength> but <verified limitation>
pushes teams to look elsewhere. <Your product> is built for <your focus>, with
<key differentiator>. Stay on <Competitor> if <their ideal case>. Switch if
<your ideal case>.
```

Plural variant closes with the shortlist instead: `The options worth evaluating: <A>, <B>, <C>, <Your product>.`

---

## Why people leave <Competitor>

Sourced from review mining and switcher interviews — see [[competitor-profiling]]. No invented pain points.

```markdown
## Why teams look for a <Competitor> alternative

Across <source: G2/Capterra/community> reviews and conversations with teams who
left, the same reasons come up:

- **<Pain 1>** — <one-line explanation of when it bites>
- **<Pain 2>** — <explanation>
- **<Pain 3>** — <explanation>

> "<verbatim complaint quote>"
> — <source, e.g. G2 review, <date>>

None of this makes <Competitor> a bad product. It makes it the wrong product for
<segment>.
```

---

## Evaluation-criteria framework (plural pages)

The highest-leverage section on a roundup: it frames the category before any product is named.

```markdown
## What to look for in a <Competitor> alternative

1. **<Criterion>** — why it matters, and what "good" looks like
2. **<Criterion>** — <same>
3. **<Criterion>** — <same>
4. **<Criterion>** — <same>

Weight these against how your team actually works, not against feature counts.
```

Rule: criteria must be defensible on their own merits. If a criterion only exists because you happen to win it, cut it.

---

## Per-alternative entry (plural pages)

Same shape for every entry, yours included. Asymmetric depth is the tell that a roundup is an ad.

```markdown
### <Alternative name>

**Best for**: <segment / use case>

<2–4 sentences: what it is, what approach it takes, who built it for whom.>

**Strengths**
- <specific, verified>
- <specific, verified>

**Limitations**
- <specific, verified>
- <specific, verified>

**Pricing**: <free tier> · from <$X/user/mo> · <notable add-on or cap>

**Bottom line**: choose <Alternative> if <scenario>.
```

---

## Paragraph comparison

For each dimension, prose first; the table only summarizes what the prose established.

```markdown
## <Dimension, e.g. Automation>

<Competitor> handles this by <their approach>. That works well for <use case>,
and <specific strength> is genuinely ahead of the field. The friction shows up
when <specific limitation and the conditions that trigger it>.

<Your product> takes a different route: <your approach>. That means <benefit>,
at the cost of <honest tradeoff>. Teams that <specific need> tend to prefer it.
```

---

## Pricing comparison

```markdown
## Pricing

| | <Competitor> | <Your product> |
|---|---|---|
| Free tier | <details or "none"> | <details> |
| Entry plan | <$X/user/mo> | <$X/user/mo> |
| Mid plan | <$X/user/mo> | <$X/user/mo> |
| Enterprise | <custom / $X> | <custom / $X> |

**What's included**: <Competitor>'s <$X> plan covers <features>; <Your product>'s
<$X> plan covers <features>.

**Beyond the sticker**: <add-ons, overage, implementation fees, annual-only
discounts, seat minimums>.

**Worked example**: for a <N>-person team, <Competitor> comes to <$X>/year and
<Your product> to <$Y>/year, with <what differs in what you get>.

_Pricing verified <YYYY-MM-DD>._
```

---

## Who it's for

Both halves are required. The "stay where you are" half is what makes the other half believable.

```markdown
## Who should stay on <Competitor>

- <specific need or constraint>
- <team type or size>
- <workflow requirement>

**Typical <Competitor> fit**: <persona in 1–2 sentences>.

## Who should switch to <Your product>

- <specific need or constraint>
- <team type or size>
- <workflow requirement>

**Typical <Your product> fit**: <persona in 1–2 sentences>.
```

---

## Migration / switching

Switching cost is the top objection on an alternatives page. Be concrete or be ignored.

```markdown
## Switching from <Competitor>

### What transfers
- <data type>: <how, any caveats>
- <data type>: <how, any caveats>

### What needs rebuilding
- <thing>: <why, and rough effort>
- <thing>: <why, and rough effort>

### How we help
- <import tool / white-glove migration>
- <migration guide link>
- <realistic timeline for a team of N>
- <support during transition>

> "<quote from a customer who made this exact switch>"
> — <Name>, <Role> at <Company>
```

---

## Switcher social proof

```markdown
## Teams who moved off <Competitor>

> "<why they left, and what changed after>"
> — <Name>, <Role> at <Company>

> "<second quote, different objection>"
> — <Name>, <Role> at <Company>
```

Only claim outcomes you can evidence. No result goes on the page without a source — mark it `[NEEDS DATA]` instead.

---

## Comparison table practices

Not this:

| Feature | <Your product> | <Competitor> |
|---|---|---|
| Feature A | yes | yes |
| Feature B | yes | no |

This:

| Feature | <Your product> | <Competitor> |
|---|---|---|
| Feature A | Full support, including <detail> | Basic, capped at <limit> |
| Feature B | <specific capability> | Not available |

- Group rows by category: core functionality, collaboration, integrations, security and compliance, support and service.
- On plural pages the summary table carries one row per alternative, not one row per feature — evaluators scan by option at that stage.
- If you use rating scales, define the scale and keep it consistent across every page.

---

## Centralized competitor data schema

One file per competitor under `plans/marketing/<campaign>/competitor-data/`. Every alternatives page — and every vs page in [[competitors]] — reads from it, so a pricing change is a single edit that propagates.

```yaml
name: <Competitor>
website: <domain>
tagline: "<their own tagline>"
last_verified: <YYYY-MM-DD>

positioning:
  primary_use_case: "<what it is actually used for>"
  target_audience: "<who they sell to>"
  market_position: "<premium / value / enterprise / etc.>"

pricing:
  model: <per-seat / usage / flat>
  free_tier: <true|false>
  free_tier_limits: "<limits>"
  entry: "<$X/user/month>"
  mid: "<$X/user/month>"
  enterprise: "<custom or $X>"
  hidden_costs: "<add-ons, minimums, implementation>"

features:          # rate or describe; keep the axes identical across competitors
  <capability>: <1-5 or short description>

strengths:         # honest; at least two
  - "<verified strength>"

weaknesses:        # sourced, never invented
  - "<verified weakness>"

best_for:
  - "<segment>"

not_ideal_for:
  - "<segment>"

common_complaints: # verbatim themes from reviews, with source
  - quote: "<complaint>"
    source: "<G2 / Capterra / community>, <date>"

migration_from:
  difficulty: <low|medium|high>
  data_export: "<formats>"
  what_transfers: "<list>"
  what_doesnt: "<list>"
  time_estimate: "<realistic range for a team of N>"
```

Keep an identically shaped file for your own product, filled in with the same honesty — including `weaknesses` and `not_ideal_for`. Pages that draw from it inherit the fairness automatically.

**Refresh cadence**: verify pricing and major features quarterly; full refresh annually; immediate update when a customer or teammate reports a competitor change.

---

## Alternatives index page

**URL**: `/alternatives`

```markdown
# <Your product> as an alternative

<Two sentences on the pattern behind why teams switch to you.>

- **[<Competitor A> alternative](/alternatives/<competitor-a>)** — better for teams who need <X>
- **[<Competitor B> alternative](/alternatives/<competitor-b>)** — better for teams who need <Y>
- **[<Competitor C> alternative](/alternatives/<competitor-c>)** — better for teams who need <Z>

## Why teams switch

<Aggregated reasons across all comparisons.>

<CTA>
```

Practices:
- Add every new alternatives page to the index the day it ships.
- Link index to page and page back to index; cross-link plural roundups to their singular deep pages.
- Show a last-updated date and the number of comparisons — both are credibility signals.
- Sort by search volume by default; offer category or alphabetical sorting once the list is long.
- Index pages can rank for broad category terms on their own, so give the intro real content, not just links.

---

## Footer column

```
Footer
└── Alternatives to
    ├── <Competitor A> alternative
    ├── <Competitor B> alternative
    ├── <Competitor C> alternative
    ├── ...
    └── View all →
```

- Up to 8 competitors, ranked by search volume, plus "View all" to `/alternatives`.
- Only build the column for pages that exist.
- Match the column header to the URL structure so the pattern is legible.
- The parallel `/vs` footer column is owned by [[competitors]] — do not duplicate it here.

---

## Provenance

Adapted from `coreyhaines31/marketingskills` (`competitors` skill — `references/templates.md` and `references/content-architecture.md`, MIT, © 2025 Corey Haines), scoped to the two alternatives formats and re-pointed at ClauKit's `plans/marketing/` output convention. The vs-page templates and the `/vs` index from the same upstream files are carried by [[competitors]].
