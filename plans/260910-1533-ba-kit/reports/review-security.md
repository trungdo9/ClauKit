# Review — Security axis (diff-scoped, Core 8)

**Fixed point** `744c271` → HEAD `3b0f793`. Package `review-package-744c271..3b0f793.md`. Agent `security-auditor` (sonnet), 2026-09-11.
**Provenance:** the agent returned this report inline and did not write the file; persisted verbatim by the orchestrator (session 2d17922d). One orchestrator note appended at the end, clearly marked.

## Security

**Method:** Core 8 only (`01 02 03 04 10 12 14 21`), diff-scoped, L1–L4 traced. Read `skills/software/security/SKILL.md` + rule refs `01,04,10,12,21` in full.

### Findings

**HIGH — PATH-TRAVERSAL (rule 10)** — unmitigated
`.claude/scripts/ba/traceability.cjs:39-40`, propagating into `.claude/scripts/ba/lib/spine-compose.cjs:165` (`fs.mkdirSync`), `spine-deliver.cjs:55`, `spine-index.cjs:159` (`fs.writeFileSync`).
Flow (source → sink): `<project-slug>` (L1 — user-supplied slash-command arg `$2`/`$3` in `deliver.md:11,15`, `spec.md:11`, `prd.md:11`, `qc.md:11`, `diagram.md:11`, `plan.md:11`) → string-interpolated by the model into `plans/ba/<project-slug>` (no code path builds this — the markdown literally instructs "Run `node .claude/scripts/ba/traceability.cjs deliver plans/ba/<project-slug> <action>`") → passed as `projectDir` CLI arg → `traceability.cjs:39` only checks `fs.existsSync`, never canonicalizes or verifies containment under `plans/ba/` → `path.join(projectDir, 'deliverables')`/`path.resolve(projectDir, 'traceability.derived.json')` → `mkdirSync`/`writeFileSync`.
"kebab-cased" (`plan.md:9` etc.) describes only the *default* derivation from repo dirname; an explicit slug is never validated against that or any allowlist anywhere in the diff.
Failing input: `/ba:deliver scope ../../../../tmp/pwn` (or any slug containing `..`) → `compose`/`deliver` create `tmp/pwn/deliverables/` and write files outside `plans/ba/` entirely, anywhere the process can reach. Same for `/ba:qc`, `/ba:spec compose`, `index/gap/validate`.
Not mitigated. No `path.resolve(...).startsWith(allowedBase)` check exists in `traceability.cjs`, `spine-index.cjs`, `spine-compose.cjs`, or `spine-deliver.cjs`.

**Checked, not vulnerable — COMMAND-INJECTION (rule 21)**
`traceability.cjs:79` and `spine-deliver.cjs:106`: `spawnSync('git', ['check-ignore', '-q', d], { cwd })` — array-arg form, no shell, no string interpolation of the path into a shell command. Mitigated by construction.

**No finding — rules 01, 02, 03, 04, 12, 14**
01: no secrets in diff (frontmatter/config values only). 02/03: no DB or HTML-render sink in this diff. 04/12: no auth/authorization surface — single-user local CLI over the operator's own filesystem, no multi-tenant object ownership model to enforce. 14: no JWT usage.

### Skipped (named, not scanned)
Signal-gated (9): `05`+`20` (no dependency manifest touched), `07` (no model binding), `08` (no deserialization of untrusted input — `JSON.parse` only ever reads the tool's own `traceability.derived.json`), `09` (no outbound HTTP client), `11` (no cookie/session auth), `13` (no password handling), `15` (no CORS config), `16` (no upload sink).
Opt-in (4): `06`, `17`, `18`, `19` — not requested.

### Totals
1 finding: 1 HIGH, 0 Critical/Medium/Low. Worst: PATH-TRAVERSAL, `traceability.cjs:39`.

### Unresolved questions
1. Is `<project-slug>` ever populated from a non-interactive/automated source (e.g., batch-imported client codes) where an attacker-adjacent string could reach it unreviewed? Severity assumes yes is plausible; if always hand-typed by the trusted local operator, downgrade to informational.
2. Should `traceability.cjs` add a slug/path allowlist (`^[a-z0-9-]+$`) centrally, or should each command markdown enforce it before invocation — the diff has neither.

---

**Orchestrator note (2d17922d, not the auditor's text):** `traceability.cjs:39-41` also requires `fs.existsSync(path.join(projectDir,'entities'))` before anything runs, so the traversal cannot create arbitrary directories — it writes `deliverables/` and `traceability.derived.json` into an *existing* directory that already holds an `entities/` tree (e.g. another project's spine). Narrower than "anywhere the process can reach", still uncontained. Handed to adversarial verify to settle severity. Same defect class as ClauKit's pre-existing R17 (`kit-resolver.js` `path.join` rebase/escape); the fix shape there — `assertContainedPath` — applies here with `plans/ba/` as the root.
