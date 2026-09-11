# ID scheme — single source

Copied verbatim from `plan.md` § Global Constraints. `spine-parse.cjs` implements these regexes and this table; it must not restate them in prose anywhere else — this file is the one place they are spelled out for a human reader.

## Ten frontmatter keys — eight required, two conditional

| key | rule |
|---|---|
| `id` | matches `DOC_ID` or `ITEM_ID`; **must equal the filename without `.md`** |
| `kind` | one of the 9 kinds below; must agree with the id prefix |
| `project` | equals the basename of the project dir |
| `title` | non-empty |
| `doc` | **item kinds only** — the document entity this renders into. Omitted (and rejected if present) on document kinds. |
| `parents` | inline array. `[]` legal only for `kind: PRD`. |
| `source` | `path/to/file.ts:88` · `doc:<file> p.N` · the literal `[UNVERIFIED]` |
| `confidence` | exactly `high`, `med`, or `low` |
| `out_of_scope` | **required on `EPIC`, optional on `FR`** — one line naming what this deliberately does not cover. Absent on every other kind. |
| `touches` | **optional on `FR`/`US`** — comma-separated module or path hints for greenfield work, or the literal `[UNKNOWN]`. Brownfield uses `source:` instead. |

## ID scheme — 9 kinds

Two **disjoint** sets, one regex each. D-10 cut seven kinds; what remains is what a two-document spec pack actually signs.

**Document kinds (2)** — a document IS a node; `doc:` may name only these, and they carry no `doc:` of their own:

| kind | id | `parents` may name |
|---|---|---|
| `PRD` | `PRD-001` | — (root; `[]` legal) |
| `SRS` | `SRS-001` | `PRD` |

**Item kinds (7)** — each requires a `doc:`:

| kind | id | `parents` may name | `doc:` |
|---|---|---|---|
| `EPIC` | `EPIC-001` | `PRD` | `PRD-001` |
| `FR` | `FR-001` | `EPIC` | `SRS-001` |
| `NFR` | `NFR-001` | `PRD`, `EPIC` | `SRS-001` |
| `UC` | `UC-001` | `FR` | `SRS-001` |
| `US` | `US-001` | `EPIC`, `FR`, `UC` | `SRS-001` |
| `AC` | `AC-012.1` | `US`, `FR` | `SRS-001` |
| `TC` | `TC-001` | `AC`, `FR`, `NFR` | `SRS-001` |

```js
const DOC_ID     = /^(PRD|SRS)-\d{3}$/;
const ITEM_ID    = /^(EPIC|FR|NFR|UC|US|TC)-\d{3}$|^AC-\d{3}\.\d{1,2}$/;
const KIND_ORDER = ['PRD','SRS','EPIC','FR','NFR','UC','US','AC','TC'];
```

**Dropped, with the reason** — `BRD`/`URD`/`UCS`/`USS`/`TCS` (most teams ship two signed documents; UC/US/TC are lists inside the SRS or composed views, not separately signed) · `BR` (business rules live in FR prose in wave 0) · `TKT` (tickets are `/ck:tickets`' model, and duplicating it here would be the twin this kit exists to avoid).

**AC prefix rule** unchanged: an `AC` id's `\d{3}` must equal its declared parent's. **Numbering** unchanged: three digits, zero-padded, unique per kind per project.
