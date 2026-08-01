# Skill Activation — the Hard Gate

**Invoke relevant skills BEFORE any response or action** — including clarifying questions and codebase exploration. This is a gate, not advice: the skills catalog (`docs/clauKit-registry.md`, discovered via `/ck:find`) exists precisely for the moments you are about to skip it.

## The rule

1. On receiving any task, first ask: *which skills cover this?* Use `/ck:find <task>` when unsure — never read the full registry into context.
2. **Announce the activation**: "Using `<skill>` to `<purpose>`" — one line, before the work starts. An unannounced skill is indistinguishable from an unused one.
3. **Process skills before implementation skills**: gates and methodology (`cook`, `verify-plan`, `tdd`, `planning`, `code-review`, `run-state`) load before domain skills (framework/library references) — the process skill decides whether the implementation skill even runs.
4. A skill's body is the source of truth while active — do not paraphrase it from memory.

## Rationalization table

Each row is a thought that precedes a skipped skill. The rebuttal is the rule.

| The thought | The reality |
|---|---|
| "This is just a simple question" | Questions are tasks. `ask`/`brainstorm`/`debugging` exist for questions; answering unaided is how wrong answers ship confidently |
| "Let me explore the codebase first" | Skills tell you *how* to explore (`/ck:scout`, multi-repo dispatch, `ck-graphify`) — exploring first means exploring wrong |
| "I remember what this skill says" | Skills evolve; your memory of a skill is a stale copy. Re-read on activation |
| "The task is urgent, no time for process" | The gates exist because urgent unguided work produced the measured failures; urgency raises the stakes, not the exemption |
| "No skill covers this exactly" | Run `/ck:find` and say so explicitly if confirmed — an explicit no-skill note is fine; a silent skip is not |
| "I'll activate it when I get to that part" | The skill shapes the plan, not just the execution — late activation inherits early mistakes |

## Verification

A session that follows this gate shows, in its first visible turn on a task: the activation line(s), or an explicit "no matching skill (`/ck:find` checked)". The behavioral eval harness (`tests/behavior/`) asserts exactly this.
