# Email Copy Guidelines

Craft rules for the individual emails inside a sequence. Sentence-level copy work belongs to [[copywriting]] and [[copy-editing]]; this file covers the email-specific constraints those skills need to respect.

Contents:
- Structure
- Formatting
- Tone
- Length
- CTAs
- Personalization
- Segmentation
- Testing and optimization
- Metrics

---

## Structure

1. **Hook** — the first line earns the second. It is also what shows in the inbox preview on some clients.
2. **Context** — why this matters to this reader, now.
3. **Value** — the useful part. If it can be removed without loss, remove the email.
4. **CTA** — one action.
5. **Sign-off** — human and warm, from a person where possible.

## Formatting

- Short paragraphs, 1–3 sentences
- White space between sections
- Bullets for anything scannable
- Bold sparingly — bolding everything bolds nothing
- Mobile-first: most sequence email is read on a phone. Single column, tappable CTA, no wide tables.

## Tone

- Conversational, not formal
- First person (I/we) and second person (you)
- Active voice
- Match brand voice from `plans/marketing-context.md`, but lean friendlier than the website
- Read it aloud. If it does not sound like a person, rewrite it.

## Length

Shorter is usually better, and length follows intent:

| Intent | Words |
|---|---|
| Transactional / notification | 50–125 |
| Educational | 150–300 |
| Story-driven | 300–500 |

If it runs long, it had better be good.

## CTAs

- Buttons for primary actions, in-text links for secondary
- Exactly one primary CTA per email
- Button text = action + outcome ("Connect your inbox", "See your first report"), never "Click here"
- The destination must match the promise. A broken message match kills conversion at the landing page — see [[cro]].

## Subject lines and preview text

- Subject: 40–60 characters. Clear beats clever, specific beats vague.
- Preview: 90–140 characters. It extends the subject — it never repeats it. Complete the thought or add intrigue.
- Emoji are polarizing; test rather than assume.

---

## Personalization

**Merge fields** — first name (fallback "there" or "friend"), company name for B2B, relevant account data (plan, usage). Every merge field needs a fallback; a broken token is worse than no personalization.

**Dynamic content** — swap blocks by segment, behavior, or lifecycle stage. Prefer dynamic blocks inside one sequence over cloning the sequence, until the copy genuinely diverges.

**Triggered sends** — action-based beats time-based on relevance whenever the event data exists: feature used, milestone hit, limit approached, inactivity detected.

**Privacy** — personalize only with data the recipient would expect you to hold. Redact PII from anything written into `plans/` (see `.claude/workflows/automation-rules.md`).

---

## Segmentation

**By behavior** — openers vs non-openers, clickers vs non-clickers, active vs inactive. Highest-value branches live here.
**By lifecycle stage** — trial vs paid, new vs tenured, engaged vs at-risk. Stage definitions come from `crm-specialist`, not from this skill.
**By profile** — industry/role (B2B), use case or goal, company size. Cheap to collect at signup; useful mainly for swapping the proof point.

---

## Testing and optimization

**What to test**, roughly in order of leverage: subject lines, send timing, sequence length and cadence, email length, CTA placement and copy, personalization depth.

**How to test:** one variable at a time, sufficient sample size, check significance before calling it, and write the learning down. An undocumented win gets re-litigated in three months.

**Metrics to track:** open rate, click rate, click-to-open, unsubscribe rate, spam complaints, sequence completion, goal conversion, revenue per email where attributable.

Upstream carried rules of thumb — open 20–40%, click 2–5%, unsubscribe under 0.5%. Treat these as orientation only: they vary hard by industry, list source, and sequence type, and Apple Mail Privacy Protection has made open rate a soft signal. Establish your own baseline from your own sends before setting a target, and prefer click-to-open and goal conversion over open rate when judging a sequence. Instrumentation and reporting: [[analytics]].
