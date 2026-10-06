# Failure Recovery Playbook

Concrete procedures for team failure modes. Treat these as protocols, not suggestions — improvisation under stress produces worse outcomes than a known playbook.

## Failure Mode 1 — Teammate Crash

**Symptom**: a teammate session terminates unexpectedly. `TeammateIdle` hook may or may not fire.

**Procedure**:
1. **Inspect TaskList** for tasks owned by the crashed teammate. Anything `in_progress` is orphaned.
2. **Read the crashed teammate's last task note** (if it exists) — captures partial progress.
3. **Read their `.claude/agent-memory/<name>/`** — preserves context across the crash.
4. **Decide**:
   - One-off crash → respawn the same teammate with the same task; their memory rehydrates them.
   - Repeated crashes → halt the team, investigate (likely a bad spawn config, OOM, or upstream issue).
5. **Reassign or respawn** via `TaskUpdate`. Don't let work sit orphaned > 5 minutes.

## Failure Mode 2 — Teammate Idle (No Pending Tasks)

**Symptom**: `TeammateIdle` hook fires but the team isn't done.

**Procedure**:
1. **Check why idle**:
   - All assigned tasks complete + no new ones queued → wind down this teammate gracefully.
   - Blocked on dependency → reassign blocker to another teammate or take it lead-side.
   - Misclassified task (no owner identified) → lead reassigns.
2. **Never let a teammate burn cycles polling an empty queue** — wind down or reassign within one cycle.

## Failure Mode 3 — Merge Conflict Between Teammates

**Symptom**: two devs touched the same file. Lead catches it during consolidation.

**Procedure**:
1. **Halt both branches**. No more commits to the conflict file until resolved.
2. **Identify which dev had ownership** (per the spawn-time ownership table).
3. **Two paths**:
   - Owner is clear → other dev's changes are reverted; owner re-applies the intent.
   - Ownership ambiguous → lead's mistake at spawn time; pick the cleaner diff, the other dev rebases.
4. **Update the ownership table** in the team's task list so it doesn't recur.
5. **Run integration tests** after resolution before continuing.

## Failure Mode 4 — Competing Hypotheses Won't Converge

**Symptom**: in `debug` template, after Phase 3 scoring no hypothesis dominates.

**Procedure** (see also `template-debug.md`):
1. **Cross-investigate**: each debugger reads the others' evidence; confidence may shift.
2. **If still no winner**: hypotheses may be **co-true** (e.g. caching + retry both bugs). Merge and spawn a single investigator.
3. **If hypotheses are all weak**: the bug doesn't have enough telemetry. Halt the debug team, add logging, re-trigger reproduction, then respawn.
4. **Never force a winner** to be done. A wrong "root cause" produces a wrong fix that masks the real bug.

## Failure Mode 5 — Lead Loses Coordination

**Symptom**: lead's context window is saturated; coordination cycles slow; tasks pile up unassigned.

**Procedure**:
1. **Trigger lead memory write**: lead persists current state (ownership table, open tasks, decisions) to its memory.
2. **Restart the lead** with a fresh context but populated memory.
3. **Optionally switch to `--delegate` mode** if lead was implementing — implementation burns context fast.
4. **Consider shrinking team** if coordination overhead exceeds parallelism gains. 3 devs may be too many; try 2.

## Failure Mode 6 — Teammate Disagreement (Non-Debug)

**Symptom**: two teammates produce contradictory outputs (e.g. dev A and dev B implemented the same API contract differently).

**Procedure**:
1. **Don't average**: pick one, not a blend. Blended designs are usually worse than either choice.
2. **Lead reads both**, decides on technical merit (not seniority).
3. **Loser rebases on winner's choice**.
4. **Record the decision in lead memory** so future spawns inherit the convention.

## Failure Mode 7 — Environment Disabled

**Symptom**: Agent Teams not available (Claude Code < 2.1.33 + no env var).

**Procedure**:
1. **Detect at spawn time** (per the `/ck:team` command's Stage 0).
2. **Warn the user** explicitly: "Agent Teams unavailable; falling back."
3. **Fall back to direct subagent delegation** via the Agent tool (single-session, no persistent teammates).
4. **Mark the request** so the user knows the fallback was used — don't silently degrade.

## When to Halt Entirely

Halt the team and write a halt brief on the spawn config (`[[cook]]` § Halt brief) when:
- Same failure mode triggers 3+ times in one run.
- Two or more teammates crash in the same session.
- Lead loses coordination after a restart.
- Merge conflicts on every consolidation cycle (ownership map is broken).

The brief's cause line goes into team-level memory so the next spawn config avoids the same trap.
