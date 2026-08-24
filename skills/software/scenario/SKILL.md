---
name: scenario
description: Design real-world test scenarios — user journeys, role-based flows, recovery paths — independent of execution tool (pytest, Playwright, Postman, etc.).
category: Testing & Debug
status: active
---

# Scenario

## Purpose

Scenario-based testing is a **design discipline**: enumerate the real-world workflows a system must support and the failure paths it must survive, then express them as runnable test cases. Tool-agnostic.

Distinct from `[[test-automation]]` — how to run tests: runners, Playwright/browser patterns, CI integration. That skill is the single testing toolkit; this one decides *which cases exist*.

## When to Use

- Greenfield feature: derive test set from requirements before implementation
- Regression triage: turn a bug report into a permanent scenario
- Acceptance testing for a release
- Role-based features (admin vs user vs guest)
- Recovery testing (network failures, retries, partial state)

Activation phrases: *"design test scenarios for..."*, *"create user-flow tests"*, *"recovery scenarios for..."*, *"acceptance criteria as scenarios"*

## Scenario Types

| Type | Question it answers |
|---|---|
| **System / golden-path** | Does the main user journey work end-to-end? |
| **Role-based** | Does each persona see the right capabilities and data? |
| **Negative** | What happens when input is invalid, missing, malicious? |
| **Recovery / failover** | What happens when a dependency fails mid-flow? |
| **Data-driven** | Does the system behave correctly across input variations? |
| **Boundary** | Off-by-one, empty set, max size, expiry edges |

A balanced suite covers every type. A suite that's 100% golden-path is theatre.

## Design Process

1. **Extract actors** — who triggers this flow? (user, admin, system job, external webhook)
2. **Map the happy path** — every step from trigger to completion, including state changes.
3. **Branch the unhappy paths** — at each step, ask: "what could go wrong?" → distinct scenario.
4. **Enumerate roles** — repeat the happy path per role; note diverging behavior.
5. **Add boundaries** — for any input with a numeric range, add min, max, min-1, max+1.
6. **Add recovery** — for any external call, add a scenario where it times out or returns 5xx.

## Scenario Template

```markdown
### Scenario: <name>
**Type**: golden | role | negative | recovery | data | boundary
**Actor**: <persona>
**Preconditions**: <state before>
**Steps**:
1. ...
2. ...
**Expected**: <observable outcome>
**Cleanup**: <state after>
```

## Tool Mapping (pick by layer)

| Layer | Tool examples | Notes |
|---|---|---|
| Unit / integration | pytest, JUnit, Vitest | See `[[test-automation]]` |
| API | Postman, curl, supertest, httpx | Express scenarios as request sequences |
| Browser / UI | Playwright, Cypress | See `[[test-automation]]` |
| End-to-end | Playwright + Postman + DB seeders | Compose layers per scenario |

The scenario itself is the same markdown spec — only the execution tool changes.

## Anti-Patterns

- **Scenario inflation**: 200 near-duplicate scenarios. Fix: parameterize via data-driven scenarios.
- **No cleanup**: tests pollute each other. Fix: every scenario declares state pre/post.
- **Golden-path-only suite**: gives false confidence. Fix: require at least 1 negative + 1 recovery per feature.
- **Implementation-coupled scenarios**: "click button X" instead of "submit form". Fix: write at user-intent level; let the executor map to UI.

## References

See `references/`:
- `browserstack-test-scenarios-2025.md` — modern methodology
- `geeksforgeeks-scenario-testing.md` — definition + canonical examples
- `testsigma-test-scenario-guide.md` — best practices, positive/negative

## Cross-links

`[[test-automation]]`, `[[tdd]]`, `[[debugging]]`
