# Known Defects

ClauKit technical debt measured during BA kit development. None of these block the BA kit; they are pre-existing issues deliberately deferred.

---

## 1. Missing LICENSE file

**What:** `package.json` declares `"license": "MIT"` and lists `"LICENSE"` in the `files` array, but no LICENSE file exists on disk, in git tracking, or in .gitignore.

**Evidence:**
- `package.json` line 3: `"license": "MIT"`
- `package.json` `files` array: includes `"LICENSE"` (verified with `jq '.files[]'`)
- `git ls-files | grep -i license` returns nothing
- `git check-ignore LICENSE*` returns nothing (file is not ignored, simply absent)
- Five `LICENSE.txt` files exist under `skills/` but are third-party vendored licenses, not the project's own MIT grant

**Blast Radius:** The MIT grant currently lives only in a JSON field. Consumers relying on legal clarity (especially in closed-source products) have no formal document to reference.

**Why Not Fixed Here:** The BA kit ships under the MIT license declared in `package.json` (D-12, decision 2026-09-10), so this is not a blocker for the kit itself. The defect predates this plan and is a ClauKit-level issue.

**No legal conclusion is drawn here; facts are stated for operational clarity.**

---

## 2. Package name unpublishable on npm

**What:** `@trungdo9/ClauKit` cannot be published to npm because npm forbids capital letters in scoped package names.

**Evidence:**
- `npm view @trungdo9/ClauKit` returns `E404` with message "name can no longer contain capital letters"
- `npm view @trungdo9/claukit` returns a plain 404, indicating the lowercase name is available
- Distribution today is via git-URL install (e.g., `npm install git+https://github.com/trungdo9/ClauKit.git#...`), which requires the repo to remain public
- Repo visibility verified: `public` (unauthenticated 200 access confirmed)

**Blast Radius:**
- `README.md` install instructions (2 references)
- `bin/lib/cli-parser.js` lines 64, 94 (User-Agent construction)
- `bin/lib/github-client.js` lines 47, 69 (User-Agent and branding)
- `.claude/metadata.json` (kit metadata)
- `package.json` itself
- Documentation and comments referencing the package name

**Complication:** `plans/260825-1134-kitforge-display-rename/phase-05-verify-and-manual-steps.md:52` contains a frozen-literal gate that asserts `p.name === "@trungdo9/ClauKit"`. A rename would immediately fail that plan's own verification step, creating a downstream collision. That plan's freeze is the prerequisite to revisit before any rename is attempted.

**Why Not Fixed Here:** This is a ClauKit distribution decision requiring coordination with the frozen KitForge display rename plan. The BA kit is not blocked by npm distribution status.

---

## 3. `npm test` runs zero tests on Node ≥ 24

**What:** The npm test script is `node --test tests/`; on Node v24.14.1, the trailing-slash directory is resolved as a module entry point, resulting in `Cannot find module '…/tests'` and zero tests executed.

**Evidence:**
- `package.json` line 8: `"test": "node --test tests/"`
- Running `npm test` on Node v24.14.1: `Cannot find module '/path/to/tests'` — no tests run, CI reports artificial "failure"
- **Workaround exists and is used by all gates in this plan:** `node --test "tests/*.test.js"` successfully discovers and runs all tests
- Baseline suite: 366 tests (349 + 17 added in this plan)

**Blast Radius:** `npm test` is the documented entry point for CI/CD; it is currently non-functional in development environments running Node ≥ 24.

**Why Not Fixed Here:** Every gate in Phase 10 already uses the working form (`node --test "tests/*.test.js"`). Fixing the script is a one-line change but is a separate concern; this plan documents and works around the issue.

---

## 4. `tests/protected-branch-guard.test.js:196` fails at baseline

**What:** One test fails on a clean tree: *"spawned in a real repository, the exit codes are the gate"*, with actual exit code 0 and expected exit code 2.

**Evidence:**
- File: `tests/protected-branch-guard.test.js`, line 196
- Test name: "spawned in a real repository, the exit codes are the gate"
- Actual: 0, Expected: 2
- Status: Pre-existing and unrelated to BA kit changes

**Blast Radius:** Baseline test count is 349; this failure is the pre-existing "-1" that every gate in this plan accounts for (expected `fail 1`, not `fail 0`).

**Why Not Fixed Here:** The defect is unrelated to BA kit functionality. All gates in this plan explicitly account for it as baseline; chasing the fix would distract from Phase 10's deliverables.

---

## 5. R17 — `resolveSourcePath` path containment

**What:** The `resolveSourcePath` function in `bin/lib/kit-resolver.js:109-118` joins every relative manifest path against `PACKAGE_ROOT` using `path.join`, which does not provide path containment. Absolute paths are silently rebased, and relative paths can escape the package root depending on root depth.

**Evidence (measured 2026-09-10):**

| Input | `path.join(root, input)` | Interpretation |
|---|---|---|
| `/tmp/x` | `<root>/tmp/x` | Absolute path silently rebased to package scope |
| `../out` | Depends on root depth; escapes at minimum | Relative path escapes package root |
| `.claude/` + 6× `../` + `etc/passwd` | `/etc/passwd` from a 5-deep root | Attacker compensates for depth; depth is a cost, not a defense |

**Exposure:** Only reachable via `ck init --kit <custom.json>` — an external manifest a user did not write. **No in-package kit or end user workflow calls `resolveSourcePath` with untrusted input**, which is why this exposure has never manifested.

**Why Not Fixed Here:** This is a real defect with zero current exposure, measured and deferred. Fixing it requires a module-level `SOURCE_ROOT` plus `setSourceRoot()` (to thread through the 7 internal call sites across 3 modules without adding parameters to `resolveSourcePath` itself), and a companion `resolvePackagePath` to keep maintenance passes pinned to `PACKAGE_ROOT`. This is its own change. D-12 dropped it from this plan specifically to avoid scope creep. The measurement here ensures a future implementer does not re-derive it.

**Why It's Documented:** Operational clarity and trace-ability for whoever eventually fixes it.

---

## Summary

- **License:** MIT declared in JSON, no formal document
- **npm publication:** Blocked by capital-letter restriction; rename collides with frozen KitForge plan
- **Test script:** Non-functional on Node ≥ 24; workaround established
- **Test failure:** Pre-existing, accounted for in all gates
- **Path containment:** Real defect, zero exposure, measurement captured for future fix

None of these block the BA kit or this plan's completion.
