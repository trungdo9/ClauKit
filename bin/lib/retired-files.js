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
];

/**
 * Shipped docs that instruct an agent to use a retired artifact, with the
 * digests of the versions that carry those instructions. Only these are
 * refreshed, and only on a digest match — a doc the user has edited is theirs.
 */
const STALE = [
  { path: ".claude/commands/ck/cook.md", sha: ["a5ea247a1c4f42fe85829fa295896b2ce199b534", "a9a7e84712edfb52ac8bb70fd4ca9950585e3bfb"] },
  { path: ".claude/commands/ck/team.md", sha: ["6376e98804c9ee366c53e5e34e9da48ac31d45d7", "b7384678452eb5c23fe3c46e0cbf3ca3bdb0bc9b", "fab5505e7c02282ab9c36e5c2cbf458161b52080"] },
  { path: ".claude/commands/ck/flow.md", sha: ["7bd42c8eea564acd1f1d19f4b8a27e7ba5ca650d", "c23cc9a10a9fd860e767c446168cc8cf140eca82", "c77789107956805866eb0e02064c1a879011702f"] },
  { path: ".claude/commands/ck/refactor.md", sha: ["70d2fc5c9318d3ec349acc8b4f06594299a597ab", "edaecd719a620f84362d5827fd5a1558af335a1e"] },
  { path: ".claude/commands/ck/fix.md", sha: ["081a6db68fb3db20f114418cd1f718e65abd991f", "c6fda115b7414a34036060f33728ea6b96df06a1", "e56d5a4098fcc031380624565663e031933efdb9"] },
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
  { path: ".claude/workflows/fix-pipeline.md", sha: ["64ac3b0994919d3c0c1dd69b19e46a8f408bf5da", "889bfe1c5e4cff693bf8fb4834e9f6fa7e85c861", "8b12e2e87435845bdfdd05f9f4efb65f951a2ecd", "e6a7f2347b7fad76834b145593ded5e51277efbc"] },
  { path: ".claude/workflows/development-rules.md", sha: ["1303c98dfb3c21bed3f117acc5d3b859d96f5505", "847d7ea0721e7703bc1070db02088b9244b62419", "a67104e6caac0fb21210aed925fbb9510d0144bb", "f09a404dfcdd30802315b247c49fea786eea40b3"] },
  { path: ".claude/skills/software/tdd/SKILL.md", sha: ["0a404fcfd04d67505b66150ae4b9976fbb7d638c", "39e82fbabe6eb9640c450ed9e8ae9e39d312fc5b", "f5a5c1e738c61888b3c944b9bc35aaacef45a609"] },
  { path: ".claude/skills/software/cook/SKILL.md", sha: ["d57a8c4520d834e9f80f408bdc1a4493200b2283", "f51691754b0a88c84ac237a6f909aff83e41e4f6"] },
  { path: ".claude/skills/software/run-state/SKILL.md", sha: ["6fb038407f22a7c9fa1a02a0c33cebfc9f2f1607"] },
  { path: ".claude/skills/software/code-review/references/verification-patterns.md", sha: ["395dba77017bc558abcb2d0f8789613ddb3665fe", "4a008d7eeabffc544ff17f059c11250589d74c20"] },
  // Both of these pointed at the retired debugging verification reference; until
  // they are refreshed the coherence gate below keeps the file, because deleting a
  // reference out from under the prose that names it is worse than leaving both.
  { path: ".claude/skills/software/debugging/SKILL.md", sha: ["d14e7306e987243528397e91774b161e8306f0de", "f134937fcaead2e789f8ada6de61c493c76d51a2"] },
  { path: ".claude/agents/engineering/debugger.md", sha: ["1fde332dc98a89be0a6c445ae1e616e733b8ea11", "7a5b7039e233693df68a493b75e31c83ace4be2d", "97a4ae05b0bca54b24066a42979592281bce01fa", "b412947def74bf6f8501020b21a268a7a105f25c", "bbc14419b913022a79e1318c241e6d71c246e9c4"] },
  // The 2026-08-21 retirements: every shipped doc that named `docs-seeker`,
  // `cti-expert` or `web-testing` as a skill to activate. Each is refreshed to
  // the version that names what replaced it — the harness's own `WebFetch` /
  // `WebSearch`, a live CVE lookup, or the merged `test-automation`. Without the
  // refresh a no-`--force` upgrade leaves prose pointing at a SKILL.md that is
  // about to be deleted, and the coherence gate below then declines to delete it.
  { path: ".claude/agents/engineering/brainstormer.md", sha: ["173aef76999dfa9d4cd1912b4d08ca2a484d3cdc", "8211f0b052688f96ade6a9be8a501b10a081f211", "adc048dcd576244e39231d8951c34c619f160d31"] },
  { path: ".claude/agents/engineering/researcher.md", sha: ["54e4446bc7a49531b62488275b1c610a76476f3f", "575eb42ea0b6ec82db6fe73dee766ecdff46da73", "a4dddfa4f24e0a08800e881be24bdc00ba74cfc3"] },
  { path: ".claude/agents/engineering/security-auditor.md", sha: ["3ae8387872e8e6a332cf3f24f6990ff04ea6eec9", "efb43cc949f49fcb65af29241d6f0d2144096a76"] },
  { path: ".claude/agents/engineering/tester.md", sha: ["3d9e7b610e12efa02b7958f557d4988d25bf7b02", "46003d9b0e9830a525af8ac327e1b46912b2909d", "d635b8ce966f7b44a3dd1248c8cf8c5c24ce7b62", "dcca71e7eaa898b55f90fa11ddb7d6b56bde252a"] },
  { path: ".claude/commands/ck/research.md", sha: ["5aabb671cc886ac7796f903d1db2144452abec63", "5db191fa71cc7c3a39996de7c6bef2b8ec8fbdcb", "b03e02296271e4953a1bea596c5eae7788ee18dd"] },
  { path: ".claude/skills/software/brainstorm/SKILL.md", sha: ["909ae4cf1b1aa0ee8c5cc590804e907f8146b8be"] },
  { path: ".claude/skills/software/ask/SKILL.md", sha: ["29b5618a23b1c10c618cc3867f9f4943395f23f7"] },
  { path: ".claude/skills/software/research/SKILL.md", sha: ["aa6edd6eef34c9fe2c6e965ad365c0bffa145333", "e64178094909b3f6b58faebd49325e266a0385c0"] },
  { path: ".claude/skills/software/scenario/SKILL.md", sha: ["190d359845fd2dc2a7b445250d1d729ee66da9c2"] },
  { path: ".claude/skills/software/chrome-devtools/SKILL.md", sha: ["7ba73b026448e8ec6cd85f0d92fc3dae2b7ee27f"] },
  { path: ".claude/skills/software/agent-browser/SKILL.md", sha: ["4f2a2f75fdd2f2ad175dac63b07a1571f8810cd2"] },
  { path: ".claude/skills/software/planning/references/research-phase.md", sha: ["a7dd9e15bc5df162217a85a926ffbbc43f52d56e"] },
  // Also the merge destination: an older install has the "Scope vs `web-testing`"
  // split still in it, pointing at the file being removed.
  { path: ".claude/skills/software/development/test-automation/SKILL.md", sha: ["5b7f8c3a458ffde57c7b5dc5b17cb53e9522bd87"] },
  // Both named `markdown-novel-viewer` as a skill to activate; refreshed to the
  // versions that point at `mdbook serve` / `markserv` / `grip` directly.
  { path: ".claude/skills/software/preview/SKILL.md", sha: ["4ba137add7b38af495632df47475c225576769f7", "7a0ebbf5b62144c7c7320d2f3fd46d46132bb10d"] },
  { path: ".claude/agents/engineering/docs-manager.md", sha: ["161c049166e49a7b9ccabae45fe1a44bb9e53500", "507f2f963c2af472bda2f64764be28d7a0ce73f0", "879260f5fbeb4a6966147ac0256c6d3ca03e26a8", "dd7625555c72282d8f09a1bbb2fa9c3286101b74", "e1431897b1d9f4c34ceee6133886ba24d59b8f3e"] },
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
      try { fs.rmdirSync(path.dirname(abs)); } catch { /* not empty: other files live there */ }
    } catch (e) {
      failed.push(`${entry.path} (remove): ${e.code || e.message}`);
    }
  }

  return { refreshed, removed, kept, failed };
}

module.exports = { syncRetired, digestOf, RETIRED, STALE };
