---
name: smell-baseline
description: The fixed set of code smells the Standards review axis always carries, even when a repo documents nothing - 12 Fowler smells as what-it-is then how-to-fix, bound by three rules (documented repo standards override, every smell is a judgement call, skip what tooling enforces)
---

# Smell Baseline

The Standards axis of a review reads [.claude/workflows/development-rules.md](../../../../workflows/development-rules.md) and `./docs/code-standards.md`. Those cover *this project's* conventions — naming, layering, file size, framework idiom. They do not describe what badly-shaped code looks like in the abstract.

This file is that missing half: a fixed baseline of code smells (Fowler, *Refactoring* ch.3) that applies **even in a repo that documents nothing**. It travels with every Standards-axis prompt — paste it in full, the subagent has no other access to it.

## Three binding rules

1. **The repo overrides.** A documented rule in `.claude/workflows/` or `./docs/code-standards.md` always wins. Where a rule endorses something the baseline would flag, suppress the smell and say nothing.
2. **Every smell is a judgement call.** Report it as a label — "possible Feature Envy" — never as a violation. Documented-standard breaches can be hard findings; baseline smells never are. This is the same pragmatism [development-rules.md](../../../../workflows/development-rules.md) asks for: "Don't be too harsh on code linting."
3. **Skip what tooling enforces.** If a linter, compiler, or the `modularization-hook.cjs` LOC warning already catches it, the reviewer adds nothing by repeating it.

A smell is worth reporting only when it appears **in the diff under review**. Pre-existing smells in untouched code are out of scope — note them once as an aside at most, never as findings.

## The 12 smells

Each reads *what it is* → *how to fix*.

| Smell | What it is | Fix |
|---|---|---|
| **Mysterious Name** | A function, variable, or type whose name doesn't reveal what it does or holds. | Rename it. If no honest name comes, the design is murky — that is the real finding. |
| **Duplicated Code** | The same logic shape appears in more than one hunk or file in the change. | Extract the shared shape, call it from both. DRY is in [development-rules.md](../../../../workflows/development-rules.md), but so is "don't be too harsh" — three similar lines is fine; abstract on the fourth. |
| **Feature Envy** | A method that reaches into another object's data more than its own. | Move the method onto the data it envies. |
| **Data Clumps** | The same few fields or params keep travelling together — a type wanting to be born. | Bundle them into one type, pass that. |
| **Primitive Obsession** | A primitive or string standing in for a domain concept that deserves its own type. | Give the concept its own small type. |
| **Repeated Switches** | The same `switch` / `if`-cascade on the same type recurs across the change. | Replace with polymorphism, or one map both sites share. |
| **Shotgun Surgery** | One logical change forces scattered edits across many files in the diff. | Gather what changes together into one module. |
| **Divergent Change** | One file or module is edited for several unrelated reasons. | Split so each module changes for one reason. Often the real cause behind a file past the 200-line guideline. |
| **Speculative Generality** | Abstraction, parameters, or hooks added for needs the spec doesn't have. | Delete it; inline back until a real need shows. This is YAGNI as a review finding — cross-check the Spec axis, it is usually scope creep too. |
| **Message Chains** | Long `a.b().c().d()` navigation the caller shouldn't depend on. | Hide the walk behind one method on the first object. |
| **Middle Man** | A class or function that mostly just delegates onward. | Cut it, call the real target directly. |
| **Refused Bequest** | A subclass or implementer that ignores or overrides most of what it inherits. | Drop the inheritance, use composition. |

## How to report one

```text
possible Data Clumps — src/orders/order-service.ts:88-140
  (customerId, postalCode, countryCode) travel together through 4 new signatures.
  → a ShippingTarget type would carry them as one.
  Judgement call: no documented rule covers this.
```

Name the smell, quote or cite the hunk, give the fix in one line, and mark it as a judgement call. No severity label — severity belongs to documented-standard breaches.

## See also

- [requesting-code-review.md](requesting-code-review.md) — where this baseline enters the Standards-axis prompt.
- [.claude/workflows/development-rules.md](../../../../workflows/development-rules.md) — YAGNI / KISS / DRY, file size, the linting-pragmatism rule that overrides this baseline.
