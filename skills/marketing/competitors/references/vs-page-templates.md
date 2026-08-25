# Section templates — head-to-head "vs" pages

Copy templates for the two formats owned by the `competitors` skill: **You vs [Competitor]** and **[Competitor A] vs [Competitor B]**. Bracketed slots are fill-ins, not placeholders to ship — every one must be replaced with verified content or removed. Anything you cannot verify becomes `[NEEDS DATA]` or "Not publicly available".

Alternatives-page templates (singular/plural) live in the `competitor-alternatives` skill.

## Contents

- TL;DR summary
- Paragraph comparison
- Feature comparison section
- Pricing comparison section
- Service and support comparison
- Who it's for section
- Migration section
- Social proof section
- Format 2 — the third-option reveal
- Comparison-table conventions

---

## TL;DR summary

Opens every vs page, above the fold.

```markdown
**TL;DR**: [Competitor] excels at [strength] but struggles with [weakness].
[Your product] is built for [your focus], offering [key differentiator].
Choose [Competitor] if [their ideal use case]. Choose [You] if [your ideal use case].
```

The last line is the whole page compressed. If a scanner reading only this block would be misled, the page is not honest enough yet.

---

## Paragraph comparison

One per major dimension, placed above or instead of the corresponding table rows.

```markdown
## [Dimension]

[Competitor] offers [description of their approach].
Their strength is [specific strength], which works well for [use case].
However, [limitation] can be challenging for [user type].

[Your product] takes a different approach with [your approach].
This means [benefit], though [honest tradeoff].
Teams who [specific need] often find this more effective.
```

The honest-tradeoff clause is mandatory. A paragraph in which your product has no cost reads as advertising and is discounted by the reader.

---

## Feature comparison section

Go beyond checkmarks — both products get strengths *and* limitations.

```markdown
## Feature Comparison

### [Feature Category]

**[Competitor]**: [2-3 sentence description of how they handle this]
- Strengths: [specific]
- Limitations: [specific]

**[Your product]**: [2-3 sentence description]
- Strengths: [specific]
- Limitations: [specific]

**Bottom line**: Choose [Competitor] if [scenario]. Choose [You] if [scenario].
```

Repeat per category. Suggested categories: core functionality, collaboration, integrations, security and compliance, support and service.

---

## Pricing comparison section

```markdown
## Pricing

| | [Competitor] | [Your Product] |
|---|---|---|
| Free tier | [Details] | [Details] |
| Starting price | $X/user/mo | $X/user/mo |
| Business tier | $X/user/mo | $X/user/mo |
| Enterprise | Custom | Custom |

*Pricing as of [date]. Verified against [source].*

**What's included**: [Competitor]'s $X plan includes [features], while
[Your product]'s $X plan includes [features].

**Total cost consideration**: Beyond per-seat pricing, consider [hidden costs,
add-ons, implementation]. [Competitor] charges extra for [X], while
[Your product] includes [Y] in base pricing.

**Value comparison**: For a [N]-person team, [Competitor] costs approximately
$X/year while [Your product] costs $Y/year, with [key differences in what you get].
```

Never compute the worked total from a price you have not confirmed on the competitor's own pricing page.

---

## Service and support comparison

```markdown
## Service & Support

| | [Competitor] | [Your Product] |
|---|---|---|
| Documentation | [Assessment] | [Assessment] |
| Response time | [Published SLA, or "Not publicly available"] | [Your SLA] |
| Support channels | [List] | [List] |
| Onboarding | [What they offer] | [What you offer] |
| CSM included | [At what tier] | [At what tier] |

**Support quality**: Based on [named review sources], [Competitor] support is
described as [assessment]. Common feedback themes include [themes].

[Your product] offers [your support approach], including [specific
differentiator — response time, dedicated CSM, implementation help].
```

Review themes are characterizations of what reviewers said, not verified facts about the product. Word them that way and name the source.

---

## Who it's for section

```markdown
## Who Should Choose [Competitor]

[Competitor] is the right choice if:
- [Specific use case or need]
- [Team type or size]
- [Workflow or requirement]
- [Budget or priority]

**Ideal [Competitor] customer**: [Persona description in 1-2 sentences]

## Who Should Choose [Your Product]

[Your product] is built for teams who:
- [Specific use case or need]
- [Team type or size]
- [Workflow or requirement]
- [Priority or value]

**Ideal [Your product] customer**: [Persona description in 1-2 sentences]
```

Test: would a prospect who genuinely belongs in the competitor's column recognize themselves there? If the competitor's list is written so no real buyer fits it, the section is a straw man and the page loses credibility.

---

## Migration section

```markdown
## Switching from [Competitor]

### What transfers
- [Data type]: [How easily, any caveats]
- [Data type]: [How easily, any caveats]

### What needs reconfiguration
- [Thing]: [Why and effort level]
- [Thing]: [Why and effort level]

### Migration support

We offer [migration support details]:
- [Free data import tool / white-glove migration]
- [Documentation / migration guide]
- [Timeline expectation]
- [Support during transition]

### What customers say about switching

> "[Quote from customer who switched]"
> — [Name], [Role] at [Company]
```

The "what needs reconfiguration" list is the credibility anchor: a migration section that claims everything transfers cleanly is not believed by anyone who has ever migrated anything.

---

## Social proof section

Switchers first — they faced the exact decision the reader is facing.

```markdown
## What Customers Say

### Switched from [Competitor]

> "[Specific quote about why they switched and the outcome]"
> — [Name], [Role] at [Company]

> "[Another quote]"
> — [Name], [Role] at [Company]

### Results after switching
- [Company] saw [specific result]
- [Company] reduced [metric] by [amount]
```

Every result line needs a real customer behind it. No composite customers, no rounded-up numbers, no unattributed quotes.

---

## Format 2 — the third-option reveal

On a `[Competitor A] vs [Competitor B]` page, this section is the only place you appear before the closing CTA.

```markdown
## A Third Option: [Your Product]

If neither [A] nor [B] fits — for example if you need [gap both share] —
[Your product] approaches this differently: [your approach in 2-3 sentences].

| | [Competitor A] | [Competitor B] | [Your Product] |
|---|---|---|---|
| [Dimension] | [Detail] | [Detail] | [Detail] |
| [Dimension] | [Detail] | [Detail] | [Detail] |
| Starting price | $X | $Y | $Z |

**Honest note**: [Your product] is not the right choice if [genuine
disqualifier] — in that case [A or B] is the better fit.
```

Place it after the reader has received a real verdict between A and B. Disclose that the page is published by the maker of the third product.

---

## Comparison-table conventions

**Replace ticks with content.**

Instead of:

| Feature | You | Competitor |
|---|---|---|
| Feature A | Yes | Yes |
| Feature B | Yes | No |

Do this:

| Feature | You | Competitor |
|---|---|---|
| Feature A | Full support with [detail] | Basic support, [limitation] |
| Feature B | [Specific capability] | Not available |

**Group rows by category** — core functionality, collaboration, integrations, security and compliance, support and service.

**Ratings need a note.** If a row uses a score, add a Notes column explaining what drove it:

| Category | You | Competitor | Notes |
|---|---|---|---|
| Ease of use | 5/5 | 4/5 | [What specifically differs] |
| Feature depth | 4/5 | 5/5 | [What they cover that you don't] |

A ratings table in which every row favours the page owner is self-defeating. If the honest scores come out that way, use prose instead — a table implies measurement and invites challenge.

Matrix layout mechanics and per-cell sourcing conventions: see the `seo-competitor-pages` skill.
