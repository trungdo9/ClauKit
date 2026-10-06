<!-- Adapted from https://github.com/cathrynlavery/diagram-design@v2.6.59:skills/diagram-design/references/type-state.md (MIT) -->
# State Machine

**Best for:** finite state logic — order status, auth state, connection lifecycle, form wizard, job queue status — and the [`Lifecycle phase map`](semantic-patterns.md#9-lifecycle-phase-map) pattern when one subject's progress, waits, retries, cancellation, and outcomes are the story.

## Routing distinctions

- Use **Sequence** for time-ordered messages between actors, including request/message lifecycles.
- Use ordinary **State Machine** for dense transition logic where events, guards, and legal transitions dominate.
- Use the **Lifecycle phase map** semantic pattern for one subject moving through 4–5 primary phases with separate wait/recovery and terminal-outcome bands.

## Layout conventions
- States are rounded rectangles (`rx=8`), labeled in Geist.
- **Start**: filled ink dot (`r=6`). **End**: ringed dot (outer `r=8` outline, inner filled `r=5`).
- Transitions: curved arrows labeled in Geist Mono as `event [guard] / action` (omit sections you don't need).
- Self-loops curve above the state.
- Orient along the dominant flow direction (left→right or top→down); rearrange before crossing transitions.
- Coral on the state the reader should notice — typically the error state, or "happy completion".

## Anti-patterns
- More transitions than states × 2 → likely two state machines.
- "From any state" transitions drawn from every state — use a single annotation (`* → Error on timeout`) instead.
- Unlabeled transitions (the whole point is *what triggers this*).

## Examples
- `assets/example-state.html` — minimal light
- `assets/example-state-lifecycle.html` — lifecycle phase map, minimal light
