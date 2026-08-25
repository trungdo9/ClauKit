# Phase 5 — Repo-wide verification, commit shape, manual GitHub steps

**Exit gate:** `git diff --name-only | wc -l && npm test 2>&1 | tail -6` → `17` and `# tests 329` / `# pass 328` / `# fail 0` / `# skipped 1` (full gate blocks in § 5.1–§ 5.5)

**Depends on**: Phases 1–4 all complete. Phase 6 is not a dependency.

**Interfaces**
- Consumes: from Phase 1 the display name `KitForge` and the identity-note wording; from Phase 4 the `package.json` `description` string (reused verbatim as the GitHub "About" text in § Manual below).
- Produces: `plans/260825-1134-kitforge-display-rename/STATE.md` with the gate evidence lines, and the manual-step checklist handed to the user.

---

## 5.1 — Diff-scope check (no collateral edits)

Exactly 17 files may differ. Anything else in the diff is a frozen file that was edited by mistake — most likely a repo-wide `sed`.

```bash
cd /home/trung/workspace/project/private/ClauKit
git diff --name-only | sort
```

**Expected, exactly these 17 lines:**

```
CLAUDE.md
MARKETING.md
README.md
bin/ck.js
bin/lib/cli-parser.js
docs/clauKit-registry.md
docs/code-standards.md
docs/codebase-summary.md
docs/deployment-guide.md
docs/design-guidelines.md
docs/project-overview-pdr.md
docs/project-roadmap.md
docs/system-architecture.md
guide/COMMANDS.md
guide/SKILLS.md
package.json
skills/marketing/README.md
```

17 distinct paths. `git diff --name-only | wc -l` → `17`.

Any of these in the diff is a **hard failure**: `CHANGELOG.md`, anything under `plans/` other than this plan's own directory, anything under `tests/`, `.gitignore`, `.claude/.gitignore`, `.claude/metadata.json`, `.claude/kits/*.json`, `bin/lib/*.js` other than `cli-parser.js`.

## 5.2 — Frozen-literal integrity (the no-breaking-change proof)

```bash
cd /home/trung/workspace/project/private/ClauKit
node -e 'const p=require("./package.json");const ok=p.name==="@trungdo9/ClauKit"&&p.version==="1.5.1"&&p.bin.ck==="./bin/ck.js"&&p.bin.claukit==="./bin/ck.js"&&p.repository.url==="https://github.com/trungdo9/ClauKit.git"&&p.homepage==="https://github.com/trungdo9/ClauKit#readme"&&p.bugs.url==="https://github.com/trungdo9/ClauKit/issues";console.log("package identity intact: "+ok)'
test -f docs/clauKit-registry.md && echo "registry filename intact: true"
test -d plans/260730-1359-clauKit-upgrade && echo "historical plan dir intact: true"
git diff --quiet -- CHANGELOG.md && echo "CHANGELOG untouched: true"
git diff --quiet -- .gitignore .claude/.gitignore && echo "gitignore pair untouched: true"
```

**Expected, exactly:**

```
package identity intact: true
registry filename intact: true
historical plan dir intact: true
CHANGELOG untouched: true
gitignore pair untouched: true
```

The gitignore check matters because `tests/installer-packaging.test.js:136` asserts `.claude/.gitignore` byte-matches the array in `bin/lib/gitignore-wire.js:38`. Both carry `# ClauKit runtime state — machine-local, never useful in history.` and both stay as they are.

## 5.3 — Full residue sweep over the in-scope set

```bash
cd /home/trung/workspace/project/private/ClauKit
FROZEN='trungdo9/ClauKit|clauKit-registry|260730-1359-clauKit-upgrade|ClauKit-CLI|`claukit`|"claukit"|ClauKit/'
chk(){ a=$(grep -o -i 'claukit' "$1"|wc -l); b=$(grep -oE "$FROZEN" "$1"|wc -l); echo "$1 total=$a frozen=$b $([ "$a" = "$b" ] && echo OK || echo FAIL)"; }
for f in README.md MARKETING.md CLAUDE.md guide/SKILLS.md guide/COMMANDS.md skills/marketing/README.md docs/codebase-summary.md docs/project-roadmap.md docs/project-overview-pdr.md docs/system-architecture.md docs/code-standards.md docs/deployment-guide.md docs/design-guidelines.md; do chk "$f"; done
sed '3d;5d' docs/clauKit-registry.md > /tmp/ck-reg-check.md; chk /tmp/ck-reg-check.md; rm -f /tmp/ck-reg-check.md
echo "casing violations: $(grep -rEoh 'Kitforge|kitForge|KITFORGE|Kit Forge' --include='*.md' --include='*.js' --include='*.json' . | grep -v node_modules | wc -l)"
echo "stale anchors: $(grep -rn '#claukit' --include='*.md' . | grep -v node_modules | grep -vc '^plans/')"
```

**Expected, exactly:**

```
README.md total=22 frozen=22 OK
MARKETING.md total=0 frozen=0 OK
CLAUDE.md total=2 frozen=2 OK
guide/SKILLS.md total=1 frozen=1 OK
guide/COMMANDS.md total=2 frozen=2 OK
skills/marketing/README.md total=1 frozen=1 OK
docs/codebase-summary.md total=14 frozen=14 OK
docs/project-roadmap.md total=4 frozen=4 OK
docs/project-overview-pdr.md total=6 frozen=6 OK
docs/system-architecture.md total=3 frozen=3 OK
docs/code-standards.md total=0 frozen=0 OK
docs/deployment-guide.md total=2 frozen=2 OK
docs/design-guidelines.md total=1 frozen=1 OK
/tmp/ck-reg-check.md total=0 frozen=0 OK
casing violations: 0
stale anchors: 0
```

## 5.4 — Test suite unchanged

```bash
cd /home/trung/workspace/project/private/ClauKit
npm test 2>&1 | tail -6
```

**Expected:** `# tests 329` · `# pass 328` · `# fail 0` · `# skipped 1` — identical to the 2026-08-25 pre-change baseline. A branding change that moves any of those four numbers has touched something functional.

## 5.5 — Commit shape (this is what keeps the version at 1.5.1)

`.releaserc.json` `releaseRules` cut a **patch release** on `type: docs` + `scope: README`, on `type: refactor`, and on `type: style`. `chore` triggers nothing under the `conventionalcommits` preset.

Commit on a branch, not on `main` (`.claude/hooks/branch-guard.cjs` is a registered PreToolUse hook):

```bash
cd /home/trung/workspace/project/private/ClauKit
git checkout -b chore/kitforge-display-rename
git add README.md MARKETING.md CLAUDE.md guide/ skills/marketing/README.md docs/ package.json bin/ck.js bin/lib/cli-parser.js plans/260825-1134-kitforge-display-rename/
git commit -m 'chore(brand): rename display name ClauKit -> KitForge (docs + CLI banner only)'
git log -1 --pretty=%s
```

**Expected:** `chore(brand): rename display name ClauKit -> KitForge (docs + CLI banner only)`

The subject must start with `chore(` — verify before pushing:

```bash
git log -1 --pretty=%s | grep -qE '^chore\(' && echo "no-release commit type: true"
```
→ `no-release commit type: true`

## 5.6 — Record evidence

Append to `plans/260825-1134-kitforge-display-rename/STATE.md`: the four gate blocks above with their actual output, the roadmap historical-lines choice from Phase 3.2, the registry-vs-`/ck:find` wording divergence from Phase 3.8, and whether Phase 6 was run or deferred.

---

## Manual steps — owner: **the user**. Cannot be done by file edit.

These are GitHub web-UI settings, not repository content. Nothing in the repo can set them, and no gate above can verify them.

### M1 — Repo "About" description

`github.com/trungdo9/ClauKit` → gear icon next to **About** → **Description**. Set to (verbatim, matches the new `package.json` `description` from Phase 4):

```
Multi-agent orchestration for coding agents — 126 curated skills, 30 agents, 57 gated commands, 3 installable kits. Installs into any project via `ck init`.
```

If GitHub's field feels long, the short form:

```
KitForge — opinionated multi-agent orchestration for coding agents. 126 skills, 30 agents, 57 gated commands, 3 kits.
```

### M2 — Repo topics

Same **About** panel → **Topics**. 

- **Add**: `kitforge`
- **Keep**: `claude-code-template` — `README.md:8` badge links to `https://github.com/topics/claude-code-template` and it is the discovery topic for the tool's actual audience. Removing it costs reach and breaks nothing gained.
- Consider adding: `multi-agent`, `ai-agents`, `developer-tools`.

### M3 — Repo name stays `ClauKit`

Explicitly **not** renamed. Every frozen URL in `plan.md` § Global Constraints resolves against it: `package.json` `repository`/`bugs`/`homepage`, `.claude/metadata.json` `installedFrom`, the README badges and install commands, `bin/ck.js:188`'s `owner/repo` API fallback, and both `docs/` "Repository:" header lines. A repo rename leaves GitHub redirects in place but breaks the "the names are unchanged" promise the identity note makes.

### M4 — Social preview image (only if one exists)

**Settings → General → Social preview**. If the current image carries a "ClauKit" wordmark, replace it or remove it. Not verified by this plan — check and report.

### M5 — Not applicable, stated so it is not asked later

No npm publish (package is not on npm — `README.md:26` installs from the Git URL). No release. No tag. No `CHANGELOG.md` entry: it is semantic-release-generated and a `chore` commit produces no release note.
