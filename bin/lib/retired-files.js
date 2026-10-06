/**
 * retired-files.js — remove what ClauKit stopped shipping, on evidence only.
 *
 * `copyPath` only ever writes, so a file dropped from the package survives in
 * every project that installed an earlier version. Leaving it there is not
 * harmless: a retired script is dead weight, and a retired SKILL.md keeps being
 * auto-discovered and can still be activated. So the installer must clean up.
 *
 * But it must not guess. Guessing is how `--force` once ate a project's own
 * `scripts/ck/deploy.js` (see file-copier.js) — `scripts/ck/wt-clean.js` is a
 * name a user could plausibly have written themselves.
 *
 * The evidence is the content itself. ClauKit knows every byte sequence it ever
 * shipped at these paths; they are in its own git history. A file whose git blob
 * digest matches one of them is ClauKit's, unmodified — that is proof, not
 * inference. Anything else is the user's: reported, never touched. The digests
 * below are `git hash-object` values, so any reviewer can regenerate and check
 * them. `cjs-migrate.js` holds itself to the same standard for the same reason.
 *
 * Removal is also gated on coherence. A no-`--force` upgrade skips existing
 * directories, so the prose that *invokes* a retired script is still on disk
 * telling an agent to run it. Deleting the script under that prose is worse
 * than leaving both. So: refresh the referencing docs first (same digest proof
 * — only where ClauKit wrote them), then remove only what nothing invokes.
 */

const fs = require("fs");
const path = require("path");
const { digestOf } = require("./blob-digest");

/**
 * Paths ClauKit used to ship, with every content digest it shipped there.
 * `token` is the string that identifies an invocation of this artifact in prose.
 *
 * Worktree fleet (T1.6 of plan 260730-1359), retired 2026-08-05: auto-provisioning
 * fired on every concurrent session, each tree paid a full dependency install, and
 * stale trees accumulated because teardown needed a session to reach `finish`.
 */
const RETIRED = [
  { path: "scripts/ck/wt-new.js", token: "wt-new", sha: ["25b613c78937cd55297583ae922c39e32b1f63ab", "278f08cb996a2714b68fa2a0fd18b8284252bb6a", "4a2d10a75ce627fdaad5b8ed34fec9f0695d5020"] },
  { path: "scripts/ck/wt-new.cjs", token: "wt-new", sha: ["e995bc3232922f4f07d13101b827f9d2104712bb"] },
  { path: "scripts/ck/wt-doctor.js", token: "wt-doctor", sha: ["ae066f4287c0f48d13adfa6d228ca2ad31288bda"] },
  { path: "scripts/ck/wt-doctor.cjs", token: "wt-doctor", sha: ["cd3cd58691c87826fb9b85ae6b19be1d965d73f5"] },
  { path: "scripts/ck/wt-clean.js", token: "wt-clean", sha: ["487451519adc34cb6b8345a25c6829292cd429c6", "dd7ff720af9b691b4744e9dae8748c1ce7067238"] },
  { path: "scripts/ck/wt-clean.cjs", token: "wt-clean", sha: ["ccd87771d07a996618756bbe80c09077e029f30a"] },
  { path: ".claude/skills/software/git/worktree/SKILL.md", token: "git/worktree", sha: ["02f12d679f9627926c6a9d0241e059c41745e09c", "2b3db7ec049c5508d662df73ba396a4753039284", "505d4079861ed3705f7cb0dcc8fe843bbec23b80", "dc8dbf93f67385d4ebcf8f859e31fa918c445a59"] },

  // Verification Iron Law, deduplicated 2026-08-06: this file was a near-copy of
  // code-review/references/verification-before-completion.md — same Iron Law, same
  // gate function, and an evidence table identical row for row. Its two remaining
  // sections were already covered by code-review/references/verification-patterns.md,
  // so consolidating ported no content. The duplication had a measurable cost: the
  // behavioural eval for this gate needed three ablation rounds before the rule was
  // actually absent from the tree, because no one could say where it lived.
  { path: ".claude/skills/software/debugging/references/verification.md", token: "references/verification.md", sha: ["65bf5575448532d8b313aaf222c83e4273ce07c0", "a04e063eaf12e644cf31e655bc93d827b9496a65"] },

  // `obsidian`, retired 2026-08-11: maintainer decision. Knowledge-only skill for
  // authoring Obsidian vaults — no agent, no command, no runtime code, and nothing
  // in ClauKit's own pipelines ever routed to it. It is out of scope for a software
  // engineering kit, and an auto-discoverable SKILL.md that nothing invokes is pure
  // activation surface. References are listed before SKILL.md so `references/` is
  // empty when its rmdir is attempted, and `obsidian/` empty when SKILL.md's is.
  { path: ".claude/skills/software/obsidian/references/obsidian-markdown.md", token: "software/obsidian", sha: ["eec70ba12bdefccb04c027f1e4875e3cc65b22bf"] },
  { path: ".claude/skills/software/obsidian/references/frontmatter-properties.md", token: "software/obsidian", sha: ["6ef93fd61127db5d2ee7c3e78ba172ff63d2f10e"] },
  { path: ".claude/skills/software/obsidian/references/vault-conventions.md", token: "software/obsidian", sha: ["e4160b7bd48538c463fb0e1c790b1005fc12909d"] },
  { path: ".claude/skills/software/obsidian/references/live-vault-mcp.md", token: "software/obsidian", sha: ["1135090f6683d9ae6b4fb56d45c5f23b82998b55"] },
  { path: ".claude/skills/software/obsidian/SKILL.md", token: "software/obsidian", sha: ["79fed9868aa7fc7957ab7fa038c8a2331e607e1a"] },

  // Three skills retired 2026-08-21, and one script that nothing ever ran.
  //
  // `docs-seeker` (script-first llms.txt/context7 doc discovery): its whole
  // premise was that fetching docs needed bespoke Node scripts. `WebFetch` +
  // `WebSearch` cover it natively, and a docs MCP server covers the rest, so the
  // skill was 17 files of shipped surface — including its own test runner — for a
  // capability the harness already has. References/workflows/scripts are listed
  // before SKILL.md so each `rmdir` fires on an already-empty directory.
  { path: ".claude/skills/global/docs-seeker/scripts/tests/run-tests.js", token: "global/docs-seeker", sha: ["a99b3faab727dccaadf5375898fd3b3b28f35e09"] },
  { path: ".claude/skills/global/docs-seeker/scripts/tests/test-analyze-llms.js", token: "global/docs-seeker", sha: ["8ea7fe9cee35f733824a9455e2655dc9a8c3aec9"] },
  { path: ".claude/skills/global/docs-seeker/scripts/tests/test-detect-topic.js", token: "global/docs-seeker", sha: ["91a6b1ee42e4fbb132ac3a874ea76c01543f871d"] },
  { path: ".claude/skills/global/docs-seeker/scripts/tests/test-fetch-docs.js", token: "global/docs-seeker", sha: ["98c6ce46a38a914c7181381a6ed02047d376caf4"] },
  { path: ".claude/skills/global/docs-seeker/scripts/utils/env-loader.js", token: "global/docs-seeker", sha: ["dc849fcb682412fe4e0906b93f24fcad15975177"] },
  { path: ".claude/skills/global/docs-seeker/scripts/analyze-llms-txt.js", token: "global/docs-seeker", sha: ["eac2f49b0ab07c8c7ca7be030f586669684d73ba"] },
  { path: ".claude/skills/global/docs-seeker/scripts/detect-topic.js", token: "global/docs-seeker", sha: ["ed3c088189f9feef862bab9eeb01754bcd67a0b6"] },
  { path: ".claude/skills/global/docs-seeker/scripts/fetch-docs.js", token: "global/docs-seeker", sha: ["f24d0aebe2f23f7cce1a2e1796b17dd8b085aa28"] },
  { path: ".claude/skills/global/docs-seeker/references/advanced.md", token: "global/docs-seeker", sha: ["9349b574e64a8f2c09662405ae4693c7e2f70d4a"] },
  { path: ".claude/skills/global/docs-seeker/references/context7-patterns.md", token: "global/docs-seeker", sha: ["b6f3c59285fec6f41dc75cc3b7feaa21f3efb630"] },
  { path: ".claude/skills/global/docs-seeker/references/errors.md", token: "global/docs-seeker", sha: ["894a719bff80a07b9e583f98df93ca6e5ab2313d"] },
  { path: ".claude/skills/global/docs-seeker/workflows/library-search.md", token: "global/docs-seeker", sha: ["88c614f3f7b7181f4b57a72494991407ab5d4418"] },
  { path: ".claude/skills/global/docs-seeker/workflows/repo-analysis.md", token: "global/docs-seeker", sha: ["daff9d276e5e6aa443dc78bbb55133acb4424afb"] },
  { path: ".claude/skills/global/docs-seeker/workflows/topic-search.md", token: "global/docs-seeker", sha: ["bb17c0ed882c6ef8fd248063d47d40169da5c1c0"] },
  { path: ".claude/skills/global/docs-seeker/.env.example", token: "global/docs-seeker", sha: ["a0bf36ebc799052e1424dd53e9d11dba29106348"] },
  { path: ".claude/skills/global/docs-seeker/package.json", token: "global/docs-seeker", sha: ["0448e25b12aa607f21d33c76ffd69fd035520450"] },
  { path: ".claude/skills/global/docs-seeker/SKILL.md", token: "global/docs-seeker", sha: ["ad004a67bd68d52fad82aeba20f348870f171154"] },

  // `cti-expert`: threat-intel knowledge with no agent, no command, and no
  // pipeline routing to it. Only `security-auditor` ever named it, as a second
  // skill to activate alongside `security` — and what it actually needed there
  // was a live CVE lookup, which is a `WebSearch` citing an advisory ID, not a
  // static prose file that ages out of date the week it ships.
  { path: ".claude/skills/software/cti-expert/SKILL.md", token: "software/cti-expert", sha: ["965de3150f796f9c9b112432bebdd8cb6fd2d59a"] },

  // `web-testing`: merged into `development/test-automation` (now v2.0.0), which
  // absorbed its Vitest and k6 halves plus the CLI cheat-sheet. The two skills
  // were split by *audience* — "app developer" vs "QA engineer" — and the split
  // never held: ~50% content overlap on Playwright basics, and the registry had
  // been carrying it as a resolved-then-reopened duplicate since 2026-05-16. The
  // real axis is which layer proves the claim, and that belongs in one file.
  { path: ".claude/skills/software/web-testing/SKILL.md", token: "software/web-testing", sha: ["afd698ff86d2bbc67934b091ece386fd6861007e"] },

  // The pattern-matching security pre-scanner: invoked by no workflow in any
  // version that shipped it, and a trial run before removal flagged a plain
  // `/regex/.exec()` call as `exec() usage CRITICAL`. The `security` skill's
  // Core Principle is reasoning-first L1-L4 tracing; a regex pass that skips
  // the tracing is cheap and wrong, and its noise costs more to triage than
  // the scan saves. The token is the filename WITH its extension, because the
  // skill's own guardrail has to be able to name the retirement in prose
  // without vetoing it.
  { path: ".claude/skills/software/security/scripts/security_scan.py", token: "security_scan.py", sha: ["7b4f7d81d1b15948c9aad2bb28896e4c5e7dad95"] },

  // Four empty overlay directories under the security rules. SKILL.md now states
  // that the kit ships the language-override hook and no overlay files; four
  // `.gitkeep`-only directories sitting there said the opposite. `rules/languages/
  // README.md` stays — it is the documented hook.
  { path: ".claude/skills/software/security/rules/languages/go/.gitkeep", token: "languages/go/", sha: ["e69de29bb2d1d6434b8b29ae775ad8c2e48c5391"] },
  { path: ".claude/skills/software/security/rules/languages/php/.gitkeep", token: "languages/php/", sha: ["e69de29bb2d1d6434b8b29ae775ad8c2e48c5391"] },
  { path: ".claude/skills/software/security/rules/languages/python/.gitkeep", token: "languages/python/", sha: ["e69de29bb2d1d6434b8b29ae775ad8c2e48c5391"] },
  { path: ".claude/skills/software/security/rules/languages/typescript/.gitkeep", token: "languages/typescript/", sha: ["e69de29bb2d1d6434b8b29ae775ad8c2e48c5391"] },

  // `global/common/` (`api_key_helper.py` + its README), retired 2026-08-21:
  // dead code for the repository's entire life. `git grep` over every commit in
  // every branch finds the import `from api_key_helper import …` in exactly one
  // file — the helper's OWN README, at each of the three paths it has lived at.
  // No Python file has ever imported it.
  //
  // It could not have worked where it claimed to. The README's documented
  // snippet resolves the helper as `Path(__file__).parent.parent.parent /
  // 'common'`, which from `<group>/<skill>/scripts/x.py` lands on
  // `<group>/common` — so it only ever resolved for a skill sitting directly
  // under `skills/global/`. The single skill that ever sat there was
  // `docs-seeker`, which is JavaScript, and is retired above. For the skill it
  // names as its consumer, `software/ai/ai-multimodal`, the snippet resolves to
  // `skills/software/ai/common` — a path that has never existed.
  //
  // And `ai-multimodal` does not need it: it carries its own `find_api_key()`
  // with its own four-tier `.env` walk. So this removal changes no behaviour.
  // Gemini is deliberately confined to `software/ai/` since the 2026-07-17
  // purge; a second, unreachable copy of that config surface at the kit root is
  // exactly the shipped-but-uninvoked weight the other retirements removed.
  //
  // Removing it empties `.claude/skills/global/`, so that path is dropped from
  // `engineer.json` and `both.json` — `checkKitPathsAvailable` exits non-zero on
  // a manifest path the package lacks, which would break `ck init` outright.
  // Both legacy install layouts are listed: the pre-`global/` `.claude/skills/
  // common/` and the current `.claude/skills/global/common/`. Each file has
  // exactly one content version in the whole history, so one digest covers every
  // install that ever received it.
  { path: ".claude/skills/global/common/README.md", token: "common/api_key_helper", sha: ["60b2e3c7f017e21b5ff43f7d29c0afc8206775b1"] },
  { path: ".claude/skills/global/common/api_key_helper.py", token: "common/api_key_helper", sha: ["9fd3e4793c4b8ba27bc08d73968a4ac11e6e974a"] },
  { path: ".claude/skills/common/README.md", token: "common/api_key_helper", sha: ["60b2e3c7f017e21b5ff43f7d29c0afc8206775b1"] },
  { path: ".claude/skills/common/api_key_helper.py", token: "common/api_key_helper", sha: ["9fd3e4793c4b8ba27bc08d73968a4ac11e6e974a"] },

  // `markdown-novel-viewer`, retired 2026-08-21: maintainer decision. One file,
  // 68 lines, telling you to run `mdbook serve`, `npx markserv`, or
  // `grip README.md`. No command routed to it and no agent required it —
  // `docs-manager` only listed it in an "auto-activate as needed" enumeration.
  //
  // Its sole reason to exist was being the other half of a scope split: on
  // 2026-07-31 `preview` was carrying a duplicated render-markdown section, and
  // the fix carved that half out into its own skill. So it was never added
  // because someone needed it — it was created to de-duplicate, and what it
  // held was three well-known CLI one-liners. The bar this kit sets is whether
  // a skill encodes something the model gets wrong unprompted; these do not.
  // `preview` keeps a three-line pointer instead, which is not a re-duplication
  // because `preview` is still presentations-only.
  { path: ".claude/skills/software/markdown-novel-viewer/SKILL.md", token: "software/markdown-novel-viewer", sha: ["28b9d68bfd4c12e9641e3e1bf7af6ae0338d89f8"] },
  // v1.7.0 shipped the BA context skill at `.claude/skills/ba/ba-context/`; it
  // installs at `.claude/skills/ba/context/` now. The other five v1.7.0 paths
  // (`ba/<name>/`) are live again since v1.9.0 and moved to STALE below — left
  // here, their unchanged reference files would match these digests and be
  // deleted right after the copy loop wrote them.
  { path: ".claude/skills/ba/ba-context/SKILL.md", token: "skills/ba/ba-context/", sha: ["48938dbfd87ff30d5a7f65086a7741307c2070d0", "ebf05db94a2d7b1e34cde1bdddb9f56ac070102d"] },
  { path: ".claude/skills/ba/ba-context/references/context-template.md", token: "skills/ba/ba-context/", sha: ["01fe695319d7bc29ffe77891bb2f096ebdceb935"] },

  // v1.8.0–1.8.1 installed the six BA skills flat at `.claude/skills/ba-<name>/`
  // so Claude Code would register them. v1.9.0 groups every kit's skills,
  // BA included, under its own folder (maintainer decision: many kits, one tree
  // per kit); the `/ba:*` commands read them by path like `/ck:*` and `/mk:*`.
  { path: ".claude/skills/ba-context/SKILL.md", token: "skills/ba-context/", sha: ["b9f4242b6715850661cf24aefb15b24397d8b94a"] },
  { path: ".claude/skills/ba-context/references/context-template.md", token: "skills/ba-context/", sha: ["01fe695319d7bc29ffe77891bb2f096ebdceb935"] },
  { path: ".claude/skills/ba-deliver/SKILL.md", token: "skills/ba-deliver/", sha: ["671e8553c6d2579737e9c4dcc2ee5e2d4fa58288"] },
  { path: ".claude/skills/ba-deliver/references/deliverable-classes.md", token: "skills/ba-deliver/", sha: ["1ebc10b02c716f6923766967d8efa0acd82ec190"] },
  { path: ".claude/skills/ba-deliver/references/sign-block.md", token: "skills/ba-deliver/", sha: ["77ae75bb118cce260735e08930b67f04e141a94a"] },
  { path: ".claude/skills/ba-diagramming/SKILL.md", token: "skills/ba-diagramming/", sha: ["3dbac8e1944a7adfc93630ea34b4c2ac38d38aa0"] },
  { path: ".claude/skills/ba-diagramming/references/mermaid-patterns.md", token: "skills/ba-diagramming/", sha: ["dfc4b16ceeda7ab2234d64f6941dcbee0c3bf9f9"] },
  { path: ".claude/skills/ba-prd/SKILL.md", token: "skills/ba-prd/", sha: ["d0ae90992503c0e624f3682dd33a5d139d9197ea"] },
  { path: ".claude/skills/ba-prd/references/prd-structure.md", token: "skills/ba-prd/", sha: ["b64840c80ed8923388b64c1af12c3b08086cb828"] },
  { path: ".claude/skills/ba-spec/SKILL.md", token: "skills/ba-spec/", sha: ["cbf6883718c106df4aa742924835da999c4dde49"] },
  { path: ".claude/skills/ba-spec/references/bp-structure.md", token: "skills/ba-spec/", sha: ["3661bfb9f7f8d966ea521a35c1e6a486f560b334"] },
  { path: ".claude/skills/ba-spec/references/compose-format.md", token: "skills/ba-spec/", sha: ["6a35dee1bd386946738e934c1720ace4e7595996"] },
  { path: ".claude/skills/ba-spec/references/cr-body.md", token: "skills/ba-spec/", sha: ["6e4fbe4e3dd398dc793a4ad34e41b7eca79145eb"] },
  { path: ".claude/skills/ba-spec/references/entity-bodies.md", token: "skills/ba-spec/", sha: ["5e98bde15310285f8fbf245463325904b5fe508c"] },
  { path: ".claude/skills/ba-traceability/SKILL.md", token: "skills/ba-traceability/", sha: ["068a5f4b148484844e95793239b166a9ddd804d8"] },
  { path: ".claude/skills/ba-traceability/references/entity-template.md", token: "skills/ba-traceability/", sha: ["4dc1fb92ec260129b290b6a5e415667d8d19f120"] },
  { path: ".claude/skills/ba-traceability/references/id-scheme.md", token: "skills/ba-traceability/", sha: ["dfcf0a0b5b3e52ce0fb3c1f697922f0b207d379d"] },
  // 2026-09-28 prune, maintainer decision: 18 skills that no command, agent or
  // workflow routed to. Two kinds. (1) Orphans — `template-skill` (a 6-line
  // placeholder whose description still read "Replace with description…"),
  // `coding-level` (claimed other skills adapt to it; none read it), `agentize`,
  // `project-organization`, `infrastructure/docker-expert` (its only skill, so the
  // group goes too), `agent-browser` (the marketing browser skills drive the CLI
  // on their own and never linked here), four design references (`excalidraw`,
  // `stitch`, `web-design-guidelines`, `mermaidjs-v11`) and the two docs-manager
  // "auto-activate" entries `mintlify` + `tech-graph` — the same shape
  // `markdown-novel-viewer` was retired for. (2) Language personas — `python-pro`,
  // `python-development`, `typescript-pro`, `nextjs-developer`, `node-specialist`,
  // `react-specialist`: generic framework knowledge the model already has, two of
  // them duplicating each other, none of them linked from an agent. Consolidating
  // ported 0 lines; the live homes are `backend-development` /
  // `frontend-development` (now wired to their agents) and `csharp-developer`,
  // kept on purpose and wired to `backend-developer`.
  // software/template-skill
  { path: ".claude/skills/software/template-skill/SKILL.md", token: "software/template-skill", sha: ["50a4f9b104357d96361e257adb70454604cd15c0"] },
  // software/coding-level
  { path: ".claude/skills/software/coding-level/references/bloom-taxonomy-for-coding.md", token: "software/coding-level", sha: ["8e979deb94f1768e97f4865fb2ca3307e98e1f04"] },
  { path: ".claude/skills/software/coding-level/references/cefr-language-model-applied.md", token: "software/coding-level", sha: ["93fb44d76c72feb7287e1490e46942acb232f789"] },
  { path: ".claude/skills/software/coding-level/references/stackoverflow-developer-skill-levels.md", token: "software/coding-level", sha: ["a89b955746f54a110fc3f677de7d3002e7e5e270"] },
  { path: ".claude/skills/software/coding-level/SKILL.md", token: "software/coding-level", sha: ["c23c7c22cbd5f2f3951aca413f232e6a046f460b"] },
  // software/agentize
  { path: ".claude/skills/software/agentize/references/anthropic-agents-tool-use.md", token: "software/agentize", sha: ["7305227ec83cb3a29dfbe6d0dc2eca6884f1cdef"] },
  { path: ".claude/skills/software/agentize/references/cli-design-guidelines.md", token: "software/agentize", sha: ["5ab340339ecdf5e03e91ac4219ebfd3d5bde18a3"] },
  { path: ".claude/skills/software/agentize/references/mcp-spec.md", token: "software/agentize", sha: ["e372c3fcddd28bc36dce014f8ccd12e61270778f"] },
  { path: ".claude/skills/software/agentize/SKILL.md", token: "software/agentize", sha: ["1e618ddfbf6a14a035d0ed3cb4274a80f15517c9", "56668cdc17b8d835d5baed1d45b37384e388ac56"] },
  // software/project-organization
  { path: ".claude/skills/software/project-organization/references/github-repository-best-practices.md", token: "software/project-organization", sha: ["b2ac4f7236e08f11b451f5958fbfbcf1d1190209"] },
  { path: ".claude/skills/software/project-organization/references/monorepo-vs-polyrepo.md", token: "software/project-organization", sha: ["afd3b88fc1dbc80361f0b9b3a7bad42766c42532"] },
  { path: ".claude/skills/software/project-organization/references/python-project-layout.md", token: "software/project-organization", sha: ["a9c4cc91e60511f6aec59416842f7717ceeaa110"] },
  { path: ".claude/skills/software/project-organization/SKILL.md", token: "software/project-organization", sha: ["884f2ff9c13a7adaec6014a9d6dda53f7c8a0e69", "f99f65021f9ab834d19769f758de86f196a6c5af"] },
  // software/infrastructure
  { path: ".claude/skills/software/infrastructure/docker-expert/SKILL.md", token: "software/infrastructure", sha: ["7137a2a47ca4a1b61bec5ba0825ae1de59573447"] },
  // software/agent-browser
  { path: ".claude/skills/software/agent-browser/SKILL.md", token: "software/agent-browser", sha: ["4f2a2f75fdd2f2ad175dac63b07a1571f8810cd2", "aeed38b8470e694b7d9a9f83f49992d29b3eaba5"] },
  // software/design/excalidraw
  { path: ".claude/skills/software/design/excalidraw/SKILL.md", token: "software/design/excalidraw", sha: ["b6b91c4c41a435ec2d989ebc4c87364ae720d563"] },
  // software/design/stitch
  { path: ".claude/skills/software/design/stitch/SKILL.md", token: "software/design/stitch", sha: ["931d14fd824cabc6195ff42d171b0ae02cbf6641"] },
  // software/design/web-design-guidelines
  { path: ".claude/skills/software/design/web-design-guidelines/SKILL.md", token: "software/design/web-design-guidelines", sha: ["ad4b62051b1b754abe16a2b5cf02f1e018b623ac"] },
  // software/design/mermaidjs-v11
  { path: ".claude/skills/software/design/mermaidjs-v11/SKILL.md", token: "software/design/mermaidjs-v11", sha: ["bf7fa8e858291c344b21acca314f5b6996c076e7"] },
  // software/development/python-pro
  { path: ".claude/skills/software/development/python-pro/SKILL.md", token: "software/development/python-pro", sha: ["de4a335b31d953fe958c783df2139eab08167705"] },
  // software/development/python-development
  { path: ".claude/skills/software/development/python-development/SKILL.md", token: "software/development/python-development", sha: ["0bebeade2e2a071962cb15dbb470efe5da8c7ae2", "98ef8930c51b9cf354fbfb0931458875c00edc8d", "e21741bc324d68189c2bfc3e98885404a6e614ab"] },
  // software/development/typescript-pro
  { path: ".claude/skills/software/development/typescript-pro/SKILL.md", token: "software/development/typescript-pro", sha: ["31615395b640cb4f0e4819d3aa5e008bc09a16bc"] },
  // software/development/nextjs-developer
  { path: ".claude/skills/software/development/nextjs-developer/references/nextjs-app-router.md", token: "software/development/nextjs-developer", sha: ["68d17dc26ea3d2553a083c7d49d6916f207d2cf1"] },
  { path: ".claude/skills/software/development/nextjs-developer/references/nextjs-data-fetching.md", token: "software/development/nextjs-developer", sha: ["7019e1ecaf575de24d3929aa7dd19e8f47870bf0"] },
  { path: ".claude/skills/software/development/nextjs-developer/references/nextjs-optimization.md", token: "software/development/nextjs-developer", sha: ["18e6a4468c743af6274e951a47a84c02f3f9cb33"] },
  { path: ".claude/skills/software/development/nextjs-developer/references/nextjs-server-components.md", token: "software/development/nextjs-developer", sha: ["8feaeef40e5eaee9236fc81e301e33d63d8c24c2"] },
  { path: ".claude/skills/software/development/nextjs-developer/SKILL.md", token: "software/development/nextjs-developer", sha: ["5f97f979e9951d02a5eafeb9a0d101e922de6a8d"] },
  // software/development/node-specialist
  { path: ".claude/skills/software/development/node-specialist/references/best-practices.md", token: "software/development/node-specialist", sha: ["6eb80f2574428f6620c0448ec770c96eff3eea9c"] },
  { path: ".claude/skills/software/development/node-specialist/references/common-snippets.md", token: "software/development/node-specialist", sha: ["ce361aac6aacd21fe1f007901eca7fedd0ff9922"] },
  { path: ".claude/skills/software/development/node-specialist/references/framework-patterns.md", token: "software/development/node-specialist", sha: ["4e21bb2524b52730c6974ec7e00efc1b0efa8655"] },
  { path: ".claude/skills/software/development/node-specialist/SKILL.md", token: "software/development/node-specialist", sha: ["1c6663a2b7078ace96b7489e08d81cb5145efa96"] },
  // software/development/react-specialist
  { path: ".claude/skills/software/development/react-specialist/SKILL.md", token: "software/development/react-specialist", sha: ["70eea9969db8b0812ef78ecba3cc34c3906de813"] },
  // software/mintlify
  { path: ".claude/skills/software/mintlify/SKILL.md", token: "software/mintlify", sha: ["d8bd890929df4d93a0d1f4eaf16db869215feeee"] },
  // software/tech-graph
  { path: ".claude/skills/software/tech-graph/SKILL.md", token: "software/tech-graph", sha: ["178eaf5173769ca1b0e86fc3db87c997f3f5f915"] },
  // `performance-agent` + `integration-agent`, retired 2026-09-28 (maintainer
  // decision, after verification). No command or workflow dispatched either;
  // the only router was the dynamic-workflow persona table. Every capability
  // already had a home: profiling/perf degradation → `debugger` (its own
  // description), slow queries → `database-admin`, k6 → `test-automation`,
  // caching/bundles → `backend-development` / `frontend-development`; OAuth,
  // webhooks, retry, rate limits → `backend-development`, payments →
  // `payment-integration`. Agents, unlike grouped skills, are registered: each
  // one's description is sent in every session, so a dead one costs every run.
  // Legacy group dirs are listed too — an old install may still carry them.
  { path: ".claude/agents/engineering/performance-agent.md", token: "performance-agent", sha: ["079bd439558963699580eb563c4a87936e4240f5", "244438636d9dca83d1d829a83766b53e1943003f"] },
  { path: ".claude/agents/development/performance-agent.md", token: "performance-agent", sha: ["079bd439558963699580eb563c4a87936e4240f5"] },
  { path: ".claude/agents/software-engineering/performance-agent.md", token: "performance-agent", sha: ["079bd439558963699580eb563c4a87936e4240f5"] },
  { path: ".claude/agents/engineering/integration-agent.md", token: "integration-agent", sha: ["90cd79ed36d2c688a9a6b37a77a5ce933c7c0000", "9873d4d8c2ff0bf94933980a773a81d6cccac166", "ba5e11d8c7cd3516111314b21d645dd2a2d5d180"] },
  { path: ".claude/agents/operations/integration-agent.md", token: "integration-agent", sha: ["3b12b9dcb18d6bf4f5f61aa25845c4abcf721ba0", "98bf18a70bab122cb6f6dbc114f37ec9b76be289", "ba5e11d8c7cd3516111314b21d645dd2a2d5d180"] },
  // 2026-10-05 prune, maintainer decision: 8 `software/` skills retired for
  // redundancy, not for missing routes (the 2026-09-28 pass took every zero-route
  // skill). `sequential-thinking` (step-numbered reasoning the model does natively;
  // its two scripts were called by nothing), `preview` (no route left after the
  // 2026-08-21 split), `show-off` (~70% `ui-styling`/`frontend-design`, and its
  // example was the purple gradient `frontend-design` bans), `ck-graphify` (named
  // only in "related skills" lists), `plans-kanban` (prescribed a `plans/00-backlog/`
  // layout that breaks the `plans/YYMMDD-HHmm-<slug>/` contract `/ck:cook` resolves
  // plans by; its BA route was a misroute), `design/ui-ux-pro-max` (promised 161
  // palettes and 57 font pairs, shipped none; its flag now reads `frontend-design`),
  // `context-engineering` (generic; its one live file `model-tiering.md` moved to
  // `dynamic-workflow/references/`), `design/aesthetic` (merged into
  // `frontend-design` — always routed as a pair; assets + references moved, so the
  // old paths below are the pre-move copies). Plus three upstream authoring scaffolds
  // under `supabase/references/` that nothing read, and two coverage artefacts.
  // context-engineering/references/model-tiering
  { path: ".claude/skills/software/context-engineering/references/model-tiering.md", token: "context-engineering/references/model-tiering", sha: ["0411f27e8468d237a3b724aef888880c72af4241", "196615531f2863d2471244b1306747e1ebed0dab", "cdce3c45844423ff69a6c29e1a06f7e9b0f214bf", "d405c7ac2e68e924f6537a9a5d16badcd7753677", "d50e0152f6a216a80a41dfec996097aae06626ad"] },
  // coverage-db.json
  { path: ".claude/skills/software/database/databases/scripts/tests/coverage-db.json", token: "coverage-db.json", sha: ["25d1e1ef8c90e8a234dbccde106c4e901ed6219f"] },
  // databases/scripts/.coverage
  { path: ".claude/skills/software/database/databases/scripts/.coverage", token: "databases/scripts/.coverage", sha: ["ed0d0ad1b5a397c0febc1522788cc7456e62caeb"] },
  // software/ck-graphify
  { path: ".claude/skills/software/ck-graphify/references/dependency-cruiser.md", token: "software/ck-graphify", sha: ["51f7b402461fdf813f443164826200855f52de98"] },
  { path: ".claude/skills/software/ck-graphify/references/python-ast-module.md", token: "software/ck-graphify", sha: ["3cf61c0904cd52745350a2986d512a1e0ea5cd49"] },
  { path: ".claude/skills/software/ck-graphify/references/tree-sitter.md", token: "software/ck-graphify", sha: ["b8765eaf27d81317523d031ed99fae15c5165b5f"] },
  { path: ".claude/skills/software/ck-graphify/SKILL.md", token: "software/ck-graphify", sha: ["4b6c449d8639581b8c08902d3e73c5ed162d53b6", "910d38a6c774f259257f4525012417ab0aaa5ca9"] },
  // software/context-engineering
  { path: ".claude/skills/software/context-engineering/references/anthropic-effective-context-engineering.md", token: "software/context-engineering", sha: ["97830449b488ed28c9851229a3ad9e1dc65a6634"] },
  { path: ".claude/skills/software/context-engineering/references/langchain-four-bucket-strategy.md", token: "software/context-engineering", sha: ["034d1e85aad12dd37cba34e12b792ecc9d4fd10b"] },
  { path: ".claude/skills/software/context-engineering/references/mem0-context-engineering-guide.md", token: "software/context-engineering", sha: ["b8096aec6f94f72114a54c16c7c2427c1034df34"] },
  { path: ".claude/skills/software/context-engineering/references/neo4j-context-vs-prompt.md", token: "software/context-engineering", sha: ["7272132e428ae455692b92f8e0441229a1b76008"] },
  { path: ".claude/skills/software/context-engineering/SKILL.md", token: "software/context-engineering", sha: ["09fb6296bb5fbb7e0990e8d7ae195b836df5e717", "5bd08a60e139ff37a88569a2fc42d77842edc5ab", "7c49ed0e5cb6c629c7a434d7d7bdd1d8d2605776", "d0980fd317bc07bd388a8d3d429b16ae07b67266"] },
  // software/design/aesthetic
  { path: ".claude/skills/software/design/aesthetic/assets/design-guideline-template.md", token: "software/design/aesthetic", sha: ["5248e480efd2ea79e824350e51cc4a5e47828fb2"] },
  { path: ".claude/skills/software/design/aesthetic/assets/design-story-template.md", token: "software/design/aesthetic", sha: ["54122515c532887751798f6b8a8598f2de2937ee"] },
  { path: ".claude/skills/software/design/aesthetic/references/design-principles.md", token: "software/design/aesthetic", sha: ["36693f55675903b67d664f613bf610e06262dc1f"] },
  { path: ".claude/skills/software/design/aesthetic/references/design-resources.md", token: "software/design/aesthetic", sha: ["c4e3477cfcc827e16bdbe0986cf8d0b0e7254907", "cedecbbceb39f8cb5c50124de2a8b17994a1fead"] },
  { path: ".claude/skills/software/design/aesthetic/references/micro-interactions.md", token: "software/design/aesthetic", sha: ["d1d2faa81d19448833321ba99a33aacff25286fd"] },
  { path: ".claude/skills/software/design/aesthetic/references/storytelling-design.md", token: "software/design/aesthetic", sha: ["4c64283304e5567e21a4d6417088c645993b10c5"] },
  { path: ".claude/skills/software/design/aesthetic/SKILL.md", token: "software/design/aesthetic", sha: ["4422cacd632cad01741d1c6c2dd9548b8715b9ed"] },
  // software/design/ui-ux-pro-max
  { path: ".claude/skills/software/design/ui-ux-pro-max/SKILL.md", token: "software/design/ui-ux-pro-max", sha: ["f5e9b63b1c8a485b120a2ae2f3c3b34becf0d1a3"] },
  // software/plans-kanban
  { path: ".claude/skills/software/plans-kanban/references/git-as-task-tracker.md", token: "software/plans-kanban", sha: ["ee83e285021d29164f3ce0e460e4316c48d339dc"] },
  { path: ".claude/skills/software/plans-kanban/references/kanban-guide-scrum-teams.md", token: "software/plans-kanban", sha: ["5ed4bcb8908ebab97f6090172dba018e2e3f8e58"] },
  { path: ".claude/skills/software/plans-kanban/references/lean-software-flow.md", token: "software/plans-kanban", sha: ["8e139da88c0e3db604b131fdd8b51d5a5047cf97"] },
  { path: ".claude/skills/software/plans-kanban/SKILL.md", token: "software/plans-kanban", sha: ["daeeb3f9b8ce44883f11bf95d3c28a5ffb851da5"] },
  // software/preview
  { path: ".claude/skills/software/preview/SKILL.md", token: "software/preview", sha: ["4ba137add7b38af495632df47475c225576769f7", "7a0ebbf5b62144c7c7320d2f3fd46d46132bb10d", "8a2c070ed75620544f0b498be156d260a1c09f88", "a95b1364475321fbbf27b21ee0510f1d0d7e82c3"] },
  // software/sequential-thinking
  { path: ".claude/skills/software/sequential-thinking/references/advanced-strategies.md", token: "software/sequential-thinking", sha: ["68a81c1d34f22f1b77db85a6e85e7f88ac9fba64"] },
  { path: ".claude/skills/software/sequential-thinking/references/advanced-techniques.md", token: "software/sequential-thinking", sha: ["e6c65d47674314100e1f215703cfcaa4af45a88d"] },
  { path: ".claude/skills/software/sequential-thinking/references/core-patterns.md", token: "software/sequential-thinking", sha: ["bbef4ff9946a5a185647c18e2d96c03ce825218f"] },
  { path: ".claude/skills/software/sequential-thinking/references/examples-api.md", token: "software/sequential-thinking", sha: ["b3f2d1748244ac326943b2572004d9852e52cd64"] },
  { path: ".claude/skills/software/sequential-thinking/references/examples-architecture.md", token: "software/sequential-thinking", sha: ["363c9803726628597e1ab2d01514da046e0bfc52"] },
  { path: ".claude/skills/software/sequential-thinking/references/examples-debug.md", token: "software/sequential-thinking", sha: ["4b7fb819babd86020193be7587e7f17f6cabc59e"] },
  { path: ".claude/skills/software/sequential-thinking/scripts/format-thought.js", token: "software/sequential-thinking", sha: ["c92a55d7a3d683c52fee631c0af320d77b648a3b"] },
  { path: ".claude/skills/software/sequential-thinking/scripts/process-thought.js", token: "software/sequential-thinking", sha: ["cce95d4fcf006d9f6fff4322fb7e776ec655f963"] },
  { path: ".claude/skills/software/sequential-thinking/tests/format-thought.test.js", token: "software/sequential-thinking", sha: ["c91a4109c720f082bc8149c52f83104571084443"] },
  { path: ".claude/skills/software/sequential-thinking/tests/process-thought.test.js", token: "software/sequential-thinking", sha: ["edb16b509ed80526165ee94c470888b7dee05dfe"] },
  { path: ".claude/skills/software/sequential-thinking/.env.example", token: "software/sequential-thinking", sha: ["4912c8722184cb5e6aa9122a238cae3a9e70d9e0"] },
  { path: ".claude/skills/software/sequential-thinking/.gitignore", token: "software/sequential-thinking", sha: ["23493dd1200bfc1367d1b6e23e0f172881927fac"] },
  { path: ".claude/skills/software/sequential-thinking/package.json", token: "software/sequential-thinking", sha: ["715e3bb4696d34cf53c116412597534cc48d69e5"] },
  { path: ".claude/skills/software/sequential-thinking/README.md", token: "software/sequential-thinking", sha: ["fe249d219b4b3ab67dff0c350aee3313b1951ba7"] },
  { path: ".claude/skills/software/sequential-thinking/SKILL.md", token: "software/sequential-thinking", sha: ["04dcfe6954311a9813964fb6becf5de66f8687bc"] },
  // software/show-off
  { path: ".claude/skills/software/show-off/SKILL.md", token: "software/show-off", sha: ["926e09668fb595a4c013779f696cb5ecb940db10"] },
  // supabase/references/_contributing.md
  { path: ".claude/skills/software/database/supabase/references/_contributing.md", token: "supabase/references/_contributing.md", sha: ["10de8ecb9ab51ef95e7fcd0fe4731b3309e58dbe"] },
  // supabase/references/_sections.md
  { path: ".claude/skills/software/database/supabase/references/_sections.md", token: "supabase/references/_sections.md", sha: ["8ba57c23e8119e411fcc8a230cda08e695792cac"] },
  // supabase/references/_template.md
  { path: ".claude/skills/software/database/supabase/references/_template.md", token: "supabase/references/_template.md", sha: ["91ace90e10a4d8ef354a82bb1994842e6979ebed"] },
];

/**
 * Shipped docs that instruct an agent to use a retired artifact, with the
 * digests of the versions that carry those instructions. Only these are
 * refreshed, and only on a digest match — a doc the user has edited is theirs.
 */
const STALE = [
  { path: ".claude/commands/ck/cook.md", sha: ["0782d9889ca2344db63a754a6653d91ef7bdfb18", "18f855427f1a3ee95bdc714ccde05c62b6c85525", "2a6079aecf4c1ba2896755d996f66bf0b10bcdab", "3e4aeda10d325294fd383f70c89b31c24f2b5b56", "4af7d14cdd9ec01dcd34ca2ba835aca2a01c48e5", "690151b1598295c4cb10fcfe8398e3e162eca047", "7f548312ab46c98758d308a8a149509786320678", "a51cd5592097c8d3c43c95f1df8b1771c3f2c6a3", "a5ea247a1c4f42fe85829fa295896b2ce199b534", "a9a7e84712edfb52ac8bb70fd4ca9950585e3bfb", "abc2acdcbea259b22bd8716afdb02aab52d4328e", "ad84b9fed7f2b3fe04260de8f2329e6db6ebb495", "b2d0b6dcabeecdca469da7fc8a060acf5c2c4ec2", "e165492780d9cc49ee1fe12e1f6effb4062be6b2", "e68919d6b8a40bdce47e1b4b6a64d23188c2be36", "f8a3fba74e8ed76291b1214e54db738ba9d70c7e"] },
  { path: ".claude/commands/ck/team.md", sha: ["6376e98804c9ee366c53e5e34e9da48ac31d45d7", "b7384678452eb5c23fe3c46e0cbf3ca3bdb0bc9b", "fab5505e7c02282ab9c36e5c2cbf458161b52080"] },
  { path: ".claude/commands/ck/flow.md", sha: ["7bd42c8eea564acd1f1d19f4b8a27e7ba5ca650d", "c23cc9a10a9fd860e767c446168cc8cf140eca82", "c77789107956805866eb0e02064c1a879011702f"] },
  { path: ".claude/commands/ck/refactor.md", sha: ["70d2fc5c9318d3ec349acc8b4f06594299a597ab", "edaecd719a620f84362d5827fd5a1558af335a1e"] },
  { path: ".claude/commands/ck/fix.md", sha: ["081a6db68fb3db20f114418cd1f718e65abd991f", "28e7b213ea0f8c3a4335c2a89a68ef381ac1638a", "4bb3a09ec0b5c33acf86e40ffc83b8014ebb476b", "75b7f5749b379aeb3aaccbe3bf2b281dfc854673", "775ca76afedfc89195e8d8ca78233de8f354443e", "8638d367f050439bb5f0e27a3b2222b0a4bf1b1b", "9b9715de609f948ffd9f0d332cf4058384444562", "a5c1914f3a03b8672a193037ad6a081f1927455c", "a90b0a514a738cb5419db1f2cec0c29a8e71bdc1", "c6fda115b7414a34036060f33728ea6b96df06a1", "d8f888b236011b3c81eb37d8ed54f280347bbdd4", "e102285e156d254351be628bb45b6a9274971fd0", "e56d5a4098fcc031380624565663e031933efdb9", "ff2c5ecb5734cac2846cb86b2ec0f684e231638d"] },
  { path: ".claude/agents/engineering/git-manager.md", sha: ["13617eaecebbee7273e6e53cb8577130ac86ae5b", "27d8cb329b1c75b77cc1d3f6619ed9248e5784d6", "a7e349c6b0197dd6a3c4fe939fd8130549cc0006", "c8490105f742997ae6a8544171960bbdd6f55e6f"] },
  // The hook only *names* the scripts in two denial messages — it never runs
  // them — so it is refreshed but deliberately not allowed to veto removal
  // (see DOC_EXTENSIONS: prose instructs an agent, an error string does not).
  { path: ".claude/hooks/guard-destructive.cjs", sha: ["22b67ee8bf966cf80d31c0778d5e1a9cce015553"] },
  // Not prose: this hook RESOLVES `scripts/ck/branch-guard.cjs` by relative path,
  // and relocate-scripts.js deletes the copy the 1.5.1 version points at. Without
  // this refresh, a no-`--force` upgrade keeps the old hook (the copy loop skips
  // an existing `.claude/hooks/`), it resolves nothing, and it fails open — the
  // shared-HEAD gate would stop existing without a single line of output.
  { path: ".claude/hooks/branch-guard.cjs", sha: ["98fcdb7a6236ea4dbb2aaa4b94c84c3b77075f32"] },
  { path: ".claude/workflows/primary-workflow.md", sha: ["ef634ed05f639d2082e012b9abbde0cbf05a756d", "f6a19d6d52cad0c301fa560cc52ca40ceaa63fef"] },
  { path: ".claude/workflows/fix-pipeline.md", sha: ["020c28ee8a09b40c283dcb7d9ddc9512a97a6060", "0a6ce2f7fd0f62b853a75baf9e2892a206e33cc8", "1706ebe91fbe3d88d54d9ff003522c4f80d22602", "1bd6227790a0bc99b8ffc93318e36f4a111e0d81", "3b274f4418348850dc0375a3faf8d8f6a8cb6c78", "64ac3b0994919d3c0c1dd69b19e46a8f408bf5da", "6729214aa182e987476ee16b63c1c42bad3d4ebe", "889bfe1c5e4cff693bf8fb4834e9f6fa7e85c861", "8b12e2e87435845bdfdd05f9f4efb65f951a2ecd", "bc3f5f819d01e424a17563646c374aaf9bdff056", "bece0a793ea397ec00ca20523ec9c4a8432dda6a", "e20c5c4673e1891feb906d661918d0cb5044e5e4", "e6a7f2347b7fad76834b145593ded5e51277efbc", "eeb9f71e1f5229f4de6b63839b7a290cd7023bf5"] },
  { path: ".claude/workflows/development-rules.md", sha: ["06aff52fe34acd442ad5ce5156b5b3aa9bac86d0", "10255c18319fc9c55632f4e43863ca4e0c960aec", "1303c98dfb3c21bed3f117acc5d3b859d96f5505", "184e84b86c630e82f226655a747eb1c7cfe86de8", "1e7dc5b25a457db3d4a433df574b2234917d335c", "3d3b13c61db8d5209e58bdf717f61172bbd49bdc", "593a9790ad82b39c8144ec345ff8e7284ca7736d", "5a8d0fff3eb698eec5f188480efda81086db5653", "5f3b1941c9df567b9d565c43dab600ce0deb0c86", "7f6f8a9064f3de1107584c6f51e9aa04de8b90be", "847d7ea0721e7703bc1070db02088b9244b62419", "9cb0801ad035cd2858c9c6b45437c4e3714a692a", "a67104e6caac0fb21210aed925fbb9510d0144bb", "e6c49c4b70a04ece986f655b9fe47bc4c7dbd7b5", "f09a404dfcdd30802315b247c49fea786eea40b3"] },
  { path: ".claude/skills/software/tdd/SKILL.md", sha: ["0a404fcfd04d67505b66150ae4b9976fbb7d638c", "39e82fbabe6eb9640c450ed9e8ae9e39d312fc5b", "f5a5c1e738c61888b3c944b9bc35aaacef45a609"] },
  { path: ".claude/skills/software/cook/SKILL.md", sha: ["d57a8c4520d834e9f80f408bdc1a4493200b2283", "f51691754b0a88c84ac237a6f909aff83e41e4f6"] },
  { path: ".claude/skills/software/run-state/SKILL.md", sha: ["6fb038407f22a7c9fa1a02a0c33cebfc9f2f1607"] },
  { path: ".claude/skills/software/code-review/references/verification-patterns.md", sha: ["395dba77017bc558abcb2d0f8789613ddb3665fe", "4a008d7eeabffc544ff17f059c11250589d74c20"] },
  // Both of these pointed at the retired debugging verification reference; until
  // they are refreshed the coherence gate below keeps the file, because deleting a
  // reference out from under the prose that names it is worse than leaving both.
  { path: ".claude/skills/software/debugging/SKILL.md", sha: ["d14e7306e987243528397e91774b161e8306f0de", "f134937fcaead2e789f8ada6de61c493c76d51a2"] },
  { path: ".claude/agents/engineering/debugger.md", sha: ["1fde332dc98a89be0a6c445ae1e616e733b8ea11", "514162f5ad3a393cff9eba3a7641622479860b79", "7a5b7039e233693df68a493b75e31c83ace4be2d", "84041801805bfc7d8b029a3f4e841118c97f2aec", "97a4ae05b0bca54b24066a42979592281bce01fa", "a18263d8c882ec036ede7b194d9aaec11f81e036", "b412947def74bf6f8501020b21a268a7a105f25c", "bbc14419b913022a79e1318c241e6d71c246e9c4", "c7ec1bed4ea7478cd10f3d0cc7899734dd7278e1"] },
  // The 2026-08-21 retirements: every shipped doc that named `docs-seeker`,
  // `cti-expert` or `web-testing` as a skill to activate. Each is refreshed to
  // the version that names what replaced it — the harness's own `WebFetch` /
  // `WebSearch`, a live CVE lookup, or the merged `test-automation`. Without the
  // refresh a no-`--force` upgrade leaves prose pointing at a SKILL.md that is
  // about to be deleted, and the coherence gate below then declines to delete it.
  { path: ".claude/agents/engineering/brainstormer.md", sha: ["173aef76999dfa9d4cd1912b4d08ca2a484d3cdc", "2a75d9785c40b3874065a69a6b77a592873b92e2", "70a291252856cc1850cbbc65a6638a198e1b49b7", "8211f0b052688f96ade6a9be8a501b10a081f211", "adc048dcd576244e39231d8951c34c619f160d31"] },
  { path: ".claude/agents/engineering/researcher.md", sha: ["54e4446bc7a49531b62488275b1c610a76476f3f", "575eb42ea0b6ec82db6fe73dee766ecdff46da73", "a4dddfa4f24e0a08800e881be24bdc00ba74cfc3"] },
  { path: ".claude/agents/engineering/security-auditor.md", sha: ["3ae8387872e8e6a332cf3f24f6990ff04ea6eec9", "efb43cc949f49fcb65af29241d6f0d2144096a76"] },
  { path: ".claude/agents/engineering/tester.md", sha: ["3d9e7b610e12efa02b7958f557d4988d25bf7b02", "401d2433fbe90826da6f05da74cd30caa549250b", "46003d9b0e9830a525af8ac327e1b46912b2909d", "b57cf5dff268c9ebce9b11ebb381b385770ae2b0", "c64f65606ef57da25a161d3dc068f2af208f1f02", "d635b8ce966f7b44a3dd1248c8cf8c5c24ce7b62", "dcca71e7eaa898b55f90fa11ddb7d6b56bde252a"] },
  { path: ".claude/commands/ck/research.md", sha: ["5aabb671cc886ac7796f903d1db2144452abec63", "5db191fa71cc7c3a39996de7c6bef2b8ec8fbdcb", "b03e02296271e4953a1bea596c5eae7788ee18dd"] },
  { path: ".claude/skills/software/brainstorm/SKILL.md", sha: ["0ae3a50f64391ad4df3924431254ca07c8875743", "909ae4cf1b1aa0ee8c5cc590804e907f8146b8be", "a065b29fb280f2aabd754653a944762b9661ac65", "d6d928a0eafbb3276045c7dcff685e4f14c05d4f", "da3b81ca08b7a52a387dce2655a2127b11f77fca"] },
  { path: ".claude/skills/software/ask/SKILL.md", sha: ["29b5618a23b1c10c618cc3867f9f4943395f23f7"] },
  { path: ".claude/skills/software/research/SKILL.md", sha: ["aa6edd6eef34c9fe2c6e965ad365c0bffa145333", "e64178094909b3f6b58faebd49325e266a0385c0"] },
  { path: ".claude/skills/software/scenario/SKILL.md", sha: ["190d359845fd2dc2a7b445250d1d729ee66da9c2"] },
  { path: ".claude/skills/software/chrome-devtools/SKILL.md", sha: ["439e290a4d82e94d17c28090d61c6e354fd7134f", "7ba73b026448e8ec6cd85f0d92fc3dae2b7ee27f"] },
  { path: ".claude/skills/software/planning/references/research-phase.md", sha: ["2267dcc3737e62d049fff8f1de84f8b4443f61e8", "a7dd9e15bc5df162217a85a926ffbbc43f52d56e"] },
  // Also the merge destination: an older install has the "Scope vs `web-testing`"
  // split still in it, pointing at the file being removed.
  { path: ".claude/skills/software/development/test-automation/SKILL.md", sha: ["5b7f8c3a458ffde57c7b5dc5b17cb53e9522bd87", "6e1a3c5122693f2efb226168f85ddad0dccd459e"] },
  // Named `markdown-novel-viewer` as a skill to activate; refreshed to the version
  // that points at `mdbook serve` / `markserv` / `grip` directly. (`preview/SKILL.md`,
  // the other one, is itself retired since 2026-10-05 — its digests are in RETIRED.)
  { path: ".claude/agents/engineering/docs-manager.md", sha: ["161c049166e49a7b9ccabae45fe1a44bb9e53500", "507f2f963c2af472bda2f64764be28d7a0ce73f0", "58700713d5657ce796fe5ee1cf34761ed200d7b2", "879260f5fbeb4a6966147ac0256c6d3ca03e26a8", "dd7625555c72282d8f09a1bbb2fa9c3286101b74", "e1431897b1d9f4c34ceee6133886ba24d59b8f3e"] },
  // BA prose that named the grouped `skills/ba/<name>/` paths (retired above).
  { path: ".claude/commands/ba/deliver.md", sha: ["5eebd3d67cac5b6ad708c25c485604053f5762cd", "f11aac94a31c10e3ccb072b1a4a0f2f6e90df368", "6fd349f03d7c4a6e97c16102faedb6f57e51e64e"] },
  { path: ".claude/commands/ba/diagram.md", sha: ["1da90435f690cc4fb3355d6e52fcacbc7c9691df", "647dbd20cb20bf3948131b77efa58a43d916319b", "5eb1582da14f3f01dd3bedde4dd7d72640e29350"] },
  { path: ".claude/commands/ba/plan.md", sha: ["a18cbd22795cc03117653065a76cf83c23c4d527", "bfeef672bdfcb89994b680293534eecc08495275", "afb5dd0d59f1ee3ccb5c154076cf05a7934cd4a1"] },
  { path: ".claude/commands/ba/prd.md", sha: ["402ff27c51091affe3fe8e61ebb500b52aa5a13c", "d1c0e5418db97a4fe9a506d345fbe410e180f471", "c855511a4be4f8e335ba861f7bc7407424239b30"] },
  { path: ".claude/commands/ba/qc.md", sha: ["0efbdc1bb467925a88d3ab73adb85aae901c92c6", "7574bc60be2823bb8512c50dda4e49218bdd052d", "d6cde2f94f80fa3d451efc276df4173a750e0eef", "e915d9c51ce46bd1b6001b33fd3b7b09f0ec8669"] },
  { path: ".claude/commands/ba/spec.md", sha: ["1b498f621421484a540b24aace4601d76c689433", "3f458ced6ff38715450154c1e0eaa114e5eccf0c", "590c61eaac173a2e30cc2498c658e21764b4656a", "9e2761a100af6dea84dc2f6ef31c4695ceffc474", "d5d1e7d3c5fc6ab0871a2677c52d4eb4e5383adf"] },
  { path: ".claude/skills/ba/README.md", sha: ["4260c0221ff6490e689c1728fa051ce127d028d7", "8f807603b7114468118783ed1362897bfc0eefa6", "b45c5806e768a2cb49b68954fcd354df64697ae3", "5b145f42eba4f8b0c4bda637d60a4324a67b84c6"] },
  { path: ".claude/workflows/business-analysis-rules.md", sha: ["16e14287f82811c83338370f29081d937b9f7372", "19bd89372e1fc5a5ab6dcad775951d67b5c83a39", "2c01bc2cd432e32db29059ca2b2aa4879f1b7383", "4b69c7ff5d7aada5ff24695c9ba0de52995fb303", "70923a35904ddfb51d853283349492083839bd9f", "735d746580ec1f462610d3c41df1644ef3755eb3", "a1f50cd0a6c1e3a1c7fe8af8f80e73e9555296ac"] },

  // v1.7.0 grouped BA skill files, live again at the same path since v1.9.0:
  // refreshed on digest proof, since the copy loop never rewrites a file.
  { path: ".claude/skills/ba/deliver/SKILL.md", sha: ["7b7cfbf6af5a6d1001a760e86b30bf62816f95d1"] },
  { path: ".claude/skills/ba/deliver/references/deliverable-classes.md", sha: ["1ebc10b02c716f6923766967d8efa0acd82ec190"] },
  { path: ".claude/skills/ba/deliver/references/sign-block.md", sha: ["77ae75bb118cce260735e08930b67f04e141a94a"] },
  { path: ".claude/skills/ba/diagramming/SKILL.md", sha: ["ea64542baff27058f1027a669b31358654fae094"] },
  { path: ".claude/skills/ba/diagramming/references/mermaid-patterns.md", sha: ["dfc4b16ceeda7ab2234d64f6941dcbee0c3bf9f9"] },
  { path: ".claude/skills/ba/prd/SKILL.md", sha: ["fca2b42283464eaffb3535cda34a9b98a5e7515b"] },
  { path: ".claude/skills/ba/prd/references/prd-structure.md", sha: ["b64840c80ed8923388b64c1af12c3b08086cb828"] },
  { path: ".claude/skills/ba/spec/SKILL.md", sha: ["29a94ae779cb98022e0768fa16eb25e6661b3977", "6c38424a536b5c97933ba681d8d7e438446f80d6", "ece7a083e6a9c0d8dea7c4a77aeecd06f5e85ad7"] },
  { path: ".claude/skills/ba/spec/references/bp-structure.md", sha: ["3661bfb9f7f8d966ea521a35c1e6a486f560b334"] },
  { path: ".claude/skills/ba/spec/references/compose-format.md", sha: ["6a35dee1bd386946738e934c1720ace4e7595996"] },
  { path: ".claude/skills/ba/spec/references/cr-body.md", sha: ["6e4fbe4e3dd398dc793a4ad34e41b7eca79145eb"] },
  { path: ".claude/skills/ba/spec/references/entity-bodies.md", sha: ["674a38ad9e9f00adcd9a77f12ef01a436dcacedf"] },
  { path: ".claude/skills/ba/traceability/SKILL.md", sha: ["30236c8318186df669fa1ee6d225cef5c03a4d6a", "4770798ac5c8bb3b8c5d399e5c4302a4a62a2e87"] },
  { path: ".claude/skills/ba/traceability/references/entity-template.md", sha: ["4dc1fb92ec260129b290b6a5e415667d8d19f120"] },
  { path: ".claude/skills/ba/traceability/references/id-scheme.md", sha: ["4d14d1f930f1a792fbc4577fbe587d0096b9d496", "dfcf0a0b5b3e52ce0fb3c1f697922f0b207d379d"] },
  // The 2026-09-28 prune: shipped docs that named a now-retired skill (bare name
  // or link). Refreshed to the versions that point at what is left instead.
  { path: ".claude/skills/software/development/bootstrap/SKILL.md", sha: ["0cdc61dbbaa9d283b89b4f881a61ae38558d5cfc", "5985d5cfcc68cd60d6d07edbed46fe0937eea3ad", "8dd936181b5bbd0ef422b5bd66d9f8974fd54951", "8f62e14293f755ab8387a60b73e3796bbe125eae", "f239b59a3ba1300763f9d9f00b88d6c727a3252c"] },
  { path: ".claude/skills/software/gkg/SKILL.md", sha: ["33862762067989eca040b1be3cb7550abb20a302", "4dd4ab745a0a94a94b0ac330f3e58b255d4ae018"] },
  // Docs that routed to a retired or never-existing agent (`performance-agent`,
  // `integration-agent`, and the long-gone `scout-external` / `ui-ux-designer` /
  // `mcp-manager` — a `subagent_type` naming no file fails the Agent call).
  { path: ".claude/skills/software/dynamic-workflow/references/inheritance-contract.md", sha: ["4e63d4b2d01a5cef60f48112f90a7e09dbc25b62", "748f897eb5b5235e10d77e836123ec119db606ee", "a16f40dc80abbb8bd2058f0bb82c140b0bb6f5dc"] },
  { path: ".claude/skills/software/port/SKILL.md", sha: ["35fb0bec0c8fb2834f9d5deccbe54f0d79ab34fe", "98ffca7116d3632b00939d1d851fce56b93ddd8f", "ac4c5342cd3af909d26e27c12e124026ff681643"] },
  { path: ".claude/skills/integrations/mcp-wordpress/SKILL.md", sha: ["54b962b760e31ea50ff9167805e0fe3e384debdb"] },
  // The 2026-10-05 prune: shipped docs that named a now-retired skill (bare name,
  // link, or the moved `model-tiering.md` path), plus the merge destination
  // `frontend-design/SKILL.md` and `frontend-developer.md`, which now carries the
  // design-skill route the commands assumed it had.
  { path: ".claude/agents/engineering/frontend-developer.md", sha: ["02999e7012b2e8dd20278b388126bbd4b817fb53", "08be2a3c61832a18183a614ba2991c724c8bc2d2", "bcd2b28288f965cf8140b48280f5dddf42b33a36"] },
  { path: ".claude/agents/engineering/planner.md", sha: ["079891e7c7254b75c74a51169aec67a96d688657", "0cad79efba401e094f35c6eaba16e3d84058dfe9", "230d208ca467326e743f2c9156a2640a80e254f3", "2364f09c9229b9645529bdb7bcd6d28fc7980401", "72cdea0e1c12237ddc5623d0063c1e877aea11ad", "b2d282dced8fbd0399c45409bfe3d26b34ab0ec4", "b7bb00ecc706d23fd364406997b4e613a4f19984", "e1fc5a9dfd3df1ec51a66d25ae2953b06b68e3bf"] },
  { path: ".claude/agents/engineering/scout.md", sha: ["57dcb6ca746b05b0977d50ccaa193459c0b8acbb", "b802231d7768f08969786b8c48e97428958477de"] },
  { path: ".claude/agents/marketing/copywriter.md", sha: ["8be19226cf009fadf736fe2c1f872c15880ecddf"] },
  { path: ".claude/commands/ck/bootstrap.md", sha: ["339a5ead7bb16aa35446dd51d141554bd6b3d39c", "50e2b8953d179d3853733e902611ab3a6575525e", "86e230a79a573f6e07c4aa224b08f1045c0a05b5", "a007c38ea3dcd9a8ee18cd9532fbb3ea11f75126", "f5f37a6a759f294d43249e22b0f09b646b5862a6"] },
  { path: ".claude/commands/ck/design.md", sha: ["44ff64e4ccd3eb5c3ebb7026a45291d71d6a07e3", "493c57ddfe01ec068c7aed67f99835a54e85dbed", "7dcdc00d00f924e8e17d33ea3fcff45169a199fd", "bc972d16546709586b2a551375cf18781f9db839", "bd5019a2d0a64a86d62632d93622c26a36dd1ef9", "dc294f6149197562b256e0764bee9723a0360327", "f60c11b5972b4d2c3f4aff105fef60a9253c2dbe"] },
  { path: ".claude/commands/ck/scout.md", sha: ["26b5612ea758beb9bd34499e9dfd4462c68f01e3", "39e9501a4cada84855f138095b333fdf40b1e1a9", "66cf6516fb2893c976f7b0d794e86ade66dbe08e", "e28fb6dd28be1e98cb1380a77c84788b9d23f8ee"] },
  { path: ".claude/workflows/cro-framework.md", sha: ["2e684e65d97c21b52ed0de568ce0e933b4f74589", "597a0d24e4e09ae8bead08bc3d2b88f2926dc9b5", "6c9c0b00e34e287a621e15a802d521d29d9d0892", "766c7012d832962f9375617021e3ffbc913405b7", "eb9debbc2c87f020005197ee965d54a8ec072299", "ec39bba5ceb6a12657d05e6ec7c35e1602850f74"] },
  { path: ".claude/workflows/design-workflow.md", sha: ["e30551ad514f885a6ef091a37e29bd6cf28b8b86"] },
  { path: ".claude/workflows/orchestration-protocol.md", sha: ["08423a4d6d6fb98d9bb81097f152d489b9cc31f7", "0e27840861a1df65e951cb7f5ecceb38b2fc7f3d", "0f90aeefcbac453f22363c452d9aadaae8807bc4", "1e1903897b538d7201c520e99775311fc1f2dbe8", "32cbd2eac3c901ed2b34736c571b5387f436103a", "59d24b12d89c2360fd825d306af11e4dc42015ae", "75e848fe3947eaed07bf68ed2bbaa2218238ce0c", "85b330b6e525b4e36ee247ac94b14df93da4553b", "8f5d3652fa24a89665c4fd237a4588fd247f8682", "bc78e123944a1cab8d02c3bd7f14ae0a890d8eca", "c959d38bd1e65dd2fceddeb48768575c7dc53dfb", "dd8884beaa24bb89082fb5f1d693fbd996a7580d", "e54603975d99f21b2ef8f76ca095fcdf81637883", "e60289595f46f7c9ef483e6ff5779e2a492854e9", "e71fa18ebd4532c2594c503014081344e259a21a"] },
  { path: ".claude/workflows/skill-activation.md", sha: ["30f7def7718fc285cf00caad22b9cc51f17de12a", "647a7240ab9f5acd218cf309941eda5d6e77118d", "9284ed857bddeb0d1366e8e16f350d52b58f00c1"] },
  { path: ".claude/skills/ba/capability-map.md", sha: ["0d8fcd448be830d5a8810beb9afb8cd9f6934e9f", "296c3f7c8e5bbc00ba8d06c79276831516c9ee61", "4598dbd6ebff5e77ddb0d52dfa4f43632e3363b7", "4e286bbbbb6a7cd3cff04b56856af6e6e2c7f1a3", "8d656f49f3396e6469cc486b42d4f3aefd5783ff", "c7533db039f77c2a7fd3fa9f567061335ecd5c00"] },
  { path: ".claude/skills/software/code-review/SKILL.md", sha: ["0624c5287c7400705934f400530b211a2fa7eaf4", "0b18140c7b22ed4873e766e3aa13a8539f44edcd", "4e184cb5aea62a405afa386ea5aecdeb0213e635", "5101c47d34cac756852b326ad2f4aad4427b6bf1", "826329ca8e41eaa46beb555e4302f5131ecd8e0f", "870e103fb70e6f0e13d62552184bff89fc07ad12", "e89bc242969c1d7b8330c33931727bf47f9f39be"] },
  { path: ".claude/skills/software/design/frontend-design/SKILL.md", sha: ["acc227f02037bd0cdd1df003d8a151f841f2caef"] },
  { path: ".claude/skills/software/dynamic-workflow/SKILL.md", sha: ["84cebc3f961df9154351273a28d0632dfc9e40df", "85327e1ef029642e53f13b99bc2306eec85bcc86", "88a3a434fb5deeafe8a9a34ff56f8623f83f1291", "b696100bae3437f38649961e65e3b1cceae82215", "c4ff21f160a07ecfb0452592ed703dd25b4c771d"] },
  { path: ".claude/skills/software/planning/references/forecasting-outcomes.md", sha: ["3a12c3caf83e829097c405e128ad79dd28686e7c"] },
  { path: ".claude/skills/software/retro/SKILL.md", sha: ["d4d78544ce6f6789653062250c025ae1164cdcbf"] },
  { path: ".claude/skills/software/team/SKILL.md", sha: ["08790dc1353bf223d0acba9001f745df824d8641", "815cfc31355c327e52d083734ef19f58de2ad46d"] },
  { path: ".claude/skills/software/to-tickets/SKILL.md", sha: ["4ee79f4cc413d7d70b6afb47c4ad52aa9ab270ca", "b099c467c4e77e78997535a264ec03a16b08e406"] },
];

/** Where shipped prose lives, and which extensions carry instructions. */
const DOC_ROOTS = [".claude", "scripts/ck"];
const DOC_EXTENSIONS = new Set([".md", ".sh", ".ps1"]);

function walk(dir, out = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (DOC_EXTENSIONS.has(path.extname(e.name))) out.push(p);
  }
  return out;
}

/**
 * Map token → "file:line" of the first doc that still invokes it. Retired paths
 * are skipped: the worktree skill naturally names the scripts it wraps, and
 * letting it veto their removal would deadlock the retirement on itself.
 */
function scanReferences(projectRoot) {
  const tokens = [...new Set(RETIRED.map((r) => r.token))];
  const retiredAbs = new Set(RETIRED.map((r) => path.join(projectRoot, r.path)));
  const found = new Map();
  for (const root of DOC_ROOTS) {
    for (const file of walk(path.join(projectRoot, root))) {
      if (retiredAbs.has(file)) continue;
      let lines;
      try {
        lines = fs.readFileSync(file, "utf-8").split("\n");
      } catch {
        continue;
      }
      lines.forEach((line, i) => {
        for (const t of tokens) {
          if (!found.has(t) && line.includes(t)) {
            found.set(t, `${path.relative(projectRoot, file)}:${i + 1}`);
          }
        }
      });
    }
  }
  return found;
}

/**
 * Bring a project in line with what ClauKit ships today: refresh the docs that
 * still describe a retired feature, then remove the retired files themselves.
 * Every write and every unlink is gated on a content digest ClauKit shipped.
 *
 * Returns { refreshed, removed, kept, failed } — `kept` carries the reason, so
 * a partial cleanup is never reported as a complete one.
 */
function syncRetired(projectRoot, resolveSourcePath) {
  const refreshed = [], removed = [], kept = [], failed = [];

  for (const entry of STALE) {
    const abs = path.join(projectRoot, entry.path);
    if (!fs.existsSync(abs) || !entry.sha.includes(digestOf(abs))) continue;
    const src = resolveSourcePath ? resolveSourcePath(entry.path) : null;
    if (!src || !fs.existsSync(src)) continue;
    try {
      fs.writeFileSync(abs, fs.readFileSync(src));
      refreshed.push(entry.path);
    } catch (e) {
      failed.push(`${entry.path} (refresh): ${e.code || e.message}`);
    }
  }

  const referencing = scanReferences(projectRoot);

  for (const entry of RETIRED) {
    const abs = path.join(projectRoot, entry.path);
    if (!fs.existsSync(abs)) continue;
    if (!entry.sha.includes(digestOf(abs))) {
      kept.push({ path: entry.path, why: "not a copy ClauKit shipped — yours, or edited by you" });
      continue;
    }
    const blocker = referencing.get(entry.token);
    if (blocker) {
      kept.push({ path: entry.path, why: `still invoked by ${blocker} — refresh it (\`--force\`) first` });
      continue;
    }
    try {
      fs.unlinkSync(abs);
      removed.push(entry.path);
      // Walk up, not one level: a retired skill removes SKILL.md before its
      // references/, so the skill dir is only empty once its last child goes.
      // rmdir refuses a non-empty dir, so this never takes anything but empties,
      // and it stops below .claude/ and the project root.
      const stops = new Set([projectRoot, path.join(projectRoot, ".claude")]);
      for (let dir = path.dirname(abs); !stops.has(dir) && dir.startsWith(projectRoot); dir = path.dirname(dir)) {
        try { fs.rmdirSync(dir); } catch { break; /* not empty: other files live there */ }
      }
    } catch (e) {
      failed.push(`${entry.path} (remove): ${e.code || e.message}`);
    }
  }

  return { refreshed, removed, kept, failed };
}

module.exports = { syncRetired, digestOf, RETIRED, STALE };
