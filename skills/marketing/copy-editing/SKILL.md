---
name: copy-editing
description: Revise and tighten copy that already exists — line editing, clarity, voice consistency, cutting fluff, proofing, and content refresh. Triggers on "edit this copy", "review my copy", "proofread", "polish this", "tighten this up", "this reads awkwardly", "too wordy", "sharpen the messaging", "copy sweep", "refresh this content", "this page is outdated", "content audit". Use when copy exists and needs improving, not writing from scratch.
allowed-tools: Read, Write, Glob, Grep
---

# Copy Editing — Seven Sweeps

> Editing is not rewriting. One dimension per pass, each edit with a stated reason, the author's message left intact.

## When this skill activates

**Implicit:** the task is to improve, review, proof, tighten, or refresh copy that already exists — a draft, a live page, an email that underperformed.
**Explicit:** "Use the copy-editing skill to [task]."
**Routed from:** `/mk:content blog` (skills: `copywriting`, `seo-content`, `copy-editing`), `.claude/workflows/marketing-workflow.md` Track A (copy) and Phase 7 "Copy review — brand voice, clarity, concision".

## Scope

Covers:
- Line editing existing copy: clarity, concision, voice consistency, rhythm.
- Cutting fluff, weak intensifiers, corporate jargon, nominalizations, passive voice.
- Flagging unsupported claims and vague language; demanding proof or specificity.
- Proofing: typos, grammar, formatting consistency, broken links.
- Content refresh on published pages: stale stats, dead examples, drifted voice.
- A scored review pass for high-stakes copy before it ships.

Does NOT cover:
- Generating new copy from a blank page → [[copywriting]] (write first, then edit here).
- Writing/scoring long-form SEO articles for E-E-A-T → [[seo-content]].
- Editorial calendar, pillars, distribution → [[content-strategy]].
- Structural/strategic page changes (layout, offer, CTA placement) → [[cro]].

**Boundary with [[copywriting]]:** [[copywriting]] owns *producing* copy. This skill owns *revising existing* copy. If the draft's core angle is wrong, hand back to [[copywriting]] for a rewrite rather than editing a bad premise into a slightly better one.

## Before editing

1. Load `plans/marketing-context.md` — brand voice, terminology, forbidden words, ICP. Every voice judgment below is measured against it, not against taste.
2. Establish the copy's goal (awareness / conversion / retention), the action it should drive, and what proof the author actually has.
3. Read the whole thing once without editing.

## The Seven Sweeps

Seven sequential passes, one dimension each. After a sweep, loop back through the earlier ones — an edit for emotion often breaks clarity.

### Sweep 1 — Clarity

Can the reader understand it on one read?

Check: confusing sentence structures · unclear pronoun references · jargon and insider language · ambiguous statements · missing context.
Common killers: sentences trying to say too much · abstract language where concrete would do · assumed reader knowledge · the point buried under qualifications.

Method: mark unclear passages on a fast read without fixing them; then propose specific edits; then verify each edit kept the original intent.
Loop check: one main idea per section; the copy addresses the reader ("you"), not itself.

### Sweep 2 — Voice and tone

Does it sound like one person, and the right one?

Check: shifts between formal and casual · inconsistent brand personality · jarring mood changes · word choices outside the brand's vocabulary.
Common issues: opens casual and turns corporate · mixes "we" and "the company" · unintentional humor next to serious claims · technical language appearing at random.

Method: read aloud, mark where the tone jumps, smooth the transitions rather than flattening the personality. Check every forbidden word from `marketing-context.md`.
Loop check: re-run Clarity.

### Sweep 3 — So what

Does every claim answer "why should I care?"

For each statement, literally ask "so what?" If nothing answers it, add the benefit bridge or cut the line.

- Weak: "Our platform uses AI-powered analytics." → *So what?*
- Better: "Our AI-powered analytics surface the patterns a manual review misses — so a decision that took a day takes an hour."

Common failures: feature lists with no benefit connection · impressive-sounding claims that don't land · capabilities without outcomes · company achievements that don't help the reader.
Loop check: Voice, then Clarity.

### Sweep 4 — Prove it

Is every claim supported?

Proof types to look for: named testimonials with specifics · case-study references · sourced statistics · third-party validation · guarantees and risk reversals · customer logos · review scores.

Common gaps: "Trusted by thousands" (which thousands?) · "Industry-leading" (per whom?) · "Customers love us" (show one saying it) · results claims without numbers.

**Truth-only, per `.claude/workflows/marketing-rules.md` §2 and [[seo-content]]:** an editor never invents the missing proof. When a claim has no evidence, the only two legal moves are (a) mark it `[NEEDS DATA]` for the author to source, or (b) soften the claim to what is defensible. Never fabricate a percentage, a customer count, a date, or a testimonial to close a gap this sweep opened.
Loop check: So what, Voice, Clarity.

### Sweep 5 — Specificity

Is it concrete enough to be believed?

Check: vague verbs ("improve", "enhance", "optimize") · statements that would fit any company · suspiciously round numbers · missing detail that would make it real.

| Vague | Specific |
|---|---|
| Save time | Save 4 hours a week |
| Many customers | 2,847 teams |
| Fast results | Results in 14 days |
| Improve your workflow | Cut reporting time in half |
| Great support | Reply within 2 hours |

The specifics in that table are illustrations of *form*, not numbers to paste in. Pull real figures from `marketing-context.md` or the author; otherwise `[NEEDS DATA]`.

Rule of thumb: content that cannot be made specific is usually filler — cut it instead of decorating it.
Loop check: Prove it, So what, Voice, Clarity.

### Sweep 6 — Heightened emotion

Does the reader feel anything?

Check: flat informational prose · pain points named but not felt · aspirations stated but not evoked.
Dimensions: pain of the current state · frustration with the alternatives · desire for the after-state · relief · pride in a smart choice.
Techniques: paint the "before" concretely · sensory language · micro-stories · shared experience · a question that prompts reflection.

Boundary: emotion serves the message. Manufactured urgency, invented scarcity, and fear that the product doesn't actually resolve are auto-reject — they read as manipulation and they contradict the Prove-it sweep.
Loop check: Specificity, Prove it, So what, Voice, Clarity.

### Sweep 7 — Zero risk

Has every barrier to action been removed?

Check the sections around each CTA: friction · unanswered objections · missing trust signals · unclear next step · hidden costs.
Risk reducers: guarantee · free trial · "no credit card required" · "cancel anytime" · social proof adjacent to the CTA · a plain statement of what happens after the click · privacy assurance.

Common issues: the CTA asks for commitment before earning trust · an objection is raised and never answered · fine print that creates doubt · "Contact us" where a specific next step belongs.
Loop check: run back through all six.

## Quick-pass checks

For small edits where a full seven-sweep is overkill.

**Cut on sight:** very, really, extremely, incredibly (weak intensifiers) · just, actually, basically (filler) · "in order to" → "to" · unnecessary "that" · things, stuff. Full delete-list in `references/plain-english-alternatives.md`.

**Replace:**

| Weak | Strong |
|---|---|
| Utilize / Leverage | Use |
| Implement | Set up |
| Facilitate | Help |
| Innovative | New |
| Robust | Strong |
| Seamless | Smooth |
| Cutting-edge | Modern |

Roughly 350 more pairs in `references/plain-english-alternatives.md`.

**Watch for:** adverbs doing a verb's job · passive voice · nominalizations ("make a decision" → "decide").

**Sentence level:** one idea per sentence · vary length · front-load the important part · max ~3 conjunctions · under ~25 words as a default.

**Paragraph level:** one topic each · 2–4 sentences for web · strong opening sentence · logical flow · white space for scannability.

## Common copy problems and fixes

| Problem | Symptom | Fix |
|---|---|---|
| Wall of features | What it does, never why it matters | Append "which means…" to each feature |
| Corporate speak | "Leverage synergies to optimize outcomes" | Ask how a human would say it; use those words |
| Weak opening | Starts with company history or a truism | Lead with the reader's problem or desired outcome |
| Buried CTA | The ask arrives late or vague | Make it obvious, early, repeated |
| No proof | "Customers love us", no evidence | Add a named testimonial or number — or soften the claim |
| Generic claims | "We help businesses grow" | Specify who, how, by how much |
| Mixed audiences | Speaks to everyone, lands with no one | Pick one audience, write to them |
| Feature overload | Every capability listed | Keep the 3–5 that matter to this ICP |

## Scored review for high-stakes copy

After the sweeps, for copy that carries real traffic or revenue: review it from 3–5 named expert perspectives, each scoring 1–10 in their lane with specific critique — not just a number. Fix the lowest scores first, re-score, iterate until every lane is 7+ and the average is 8+.

Suggested panels:
- **Landing page** — conversion copywriter (benefit hierarchy, CTA strength) · UX writer (scannability, cognitive load) · the target ICP persona (does this speak to me, do I trust it) · brand strategist (voice, positioning accuracy).
- **Email sequence** — email specialist (subject line, open/click) · copywriter (hook, persuasion) · deliverability reviewer (trigger words, spam signals) · the ICP persona (relevance, unsubscribe risk).
- **Sales / long-form** — direct-response copywriter (offer, objections) · skeptical buyer (proof gaps, red flags) · editor (flow, concision) · SEO reviewer (intent alignment).

| Score | Meaning |
|---|---|
| 9–10 | Publish-ready |
| 7–8 | Strong; minor tweaks |
| 5–6 | Functional, clear gaps; another pass |
| 3–4 | Major revision |
| 1–2 | Wrong premise; back to [[copywriting]] |

Always for launch copy, pricing pages, high-traffic landing pages. Recommended for email sequences and ad copy. Skip for quick fixes and low-stakes internal text.

The scores are a review instrument, not a measurement — never report them as evidence of performance. Only a test reports performance → [[cro]].

## Content refresh

Published pages decay: stats age out, examples die, the brand voice moves on, the product changes underneath the copy. Refresh triggers, the six-pass refresh checklist, the refresh-vs-rewrite matrix, and cadence by page type: `references/content-refresh.md`.

## Working the edit collaboratively

1. Run one sweep, present findings — what was found and why it's a problem.
2. Propose specific replacement text, never just a complaint.
3. Hand the decision to the author; they own the copy.
4. After each accepted round, re-check the earlier sweeps.
5. Stop when a full sweep surfaces nothing new.

## Key concepts

- **Sweep** — one editing pass over the whole piece on exactly one dimension; focus is what makes it catch things.
- **Loop-back** — re-checking earlier sweeps after later edits, because fixing one dimension routinely breaks another.
- **Benefit bridge** — the "which means…" clause that converts a feature into a reason to care.
- **`[NEEDS DATA]`** — the editor's marker for a claim needing evidence the editor must not invent.
- **Refresh vs. rewrite** — details stale but angle valid → refresh; angle or audience shifted → back to [[copywriting]].
- **Preserve the message** — the edit improves how it lands, not what it says.

## Output

- Edited copy written back beside the source: `plans/marketing/<campaign>/content/<asset>.md` (per `.claude/workflows/marketing-rules.md` §6). Keep the original; write the edit as a sibling or a clearly marked revision.
- Sweep report: `plans/marketing/<campaign>/copy-edit-report.md` — per sweep, findings with the reason, proposed replacement text, and any `[NEEDS DATA]` flags left for the author.
- For quick reviews: inline findings and replacement text in the conversation, no file.

## Cross-references

- `plans/marketing-context.md` — required hub (brand voice, terminology, forbidden words, ICP)
- `.claude/workflows/marketing-rules.md` — §2 no fluff / no hallucinated metrics, §3 quality gates, §6 output conventions, §7 anti-patterns
- [[copywriting]] — writes the draft this skill edits; owns rewrites
- [[seo-content]] — truth-only + anti-fluff rules this skill's Prove-it and Specificity sweeps enforce; owns E-E-A-T scoring
- [[cro]] — structural page changes and actual conversion testing
- [[content-strategy]] — calendar, pillars, distribution
- `references/plain-english-alternatives.md` — ~350 complex→plain word swaps plus a delete-on-sight phrase list
- `references/content-refresh.md` — refresh triggers, checklist, refresh-vs-rewrite matrix, cadence
- `references/checklist.md` — final QA pass across all seven sweeps

## Provenance

Imported from `coreyhaines31/marketingskills` (`skills/copy-editing/`) and adapted for ClauKit: ClauKit frontmatter and wikilinks, context path repointed from the upstream `.agents/product-marketing.md` to `plans/marketing-context.md`, Prove-it/Specificity sweeps aligned with the house truth-only rule (`marketing-rules.md` §2 + [[seo-content]]), upstream `marketing-psychology`/`ab-testing`/`ai-seo` pointers redirected to [[cro]] and [[seo-geo]], and the upstream `evals/` harness dropped (no ClauKit equivalent). The Seven Sweeps, the word/sentence/paragraph checks, the problem→fix set, and all three reference files are preserved from source.
