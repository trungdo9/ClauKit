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
  { path: ".claude/workflows/development-rules.md", sha: ["1303c98dfb3c21bed3f117acc5d3b859d96f5505", "847d7ea0721e7703bc1070db02088b9244b62419", "f09a404dfcdd30802315b247c49fea786eea40b3"] },
  { path: ".claude/skills/software/tdd/SKILL.md", sha: ["0a404fcfd04d67505b66150ae4b9976fbb7d638c", "39e82fbabe6eb9640c450ed9e8ae9e39d312fc5b"] },
  { path: ".claude/skills/software/cook/SKILL.md", sha: ["d57a8c4520d834e9f80f408bdc1a4493200b2283", "f51691754b0a88c84ac237a6f909aff83e41e4f6"] },
  { path: ".claude/skills/software/run-state/SKILL.md", sha: ["6fb038407f22a7c9fa1a02a0c33cebfc9f2f1607"] },
  { path: ".claude/skills/software/code-review/references/verification-patterns.md", sha: ["395dba77017bc558abcb2d0f8789613ddb3665fe", "4a008d7eeabffc544ff17f059c11250589d74c20"] },
  // Both of these pointed at the retired debugging verification reference; until
  // they are refreshed the coherence gate below keeps the file, because deleting a
  // reference out from under the prose that names it is worse than leaving both.
  { path: ".claude/skills/software/debugging/SKILL.md", sha: ["d14e7306e987243528397e91774b161e8306f0de", "f134937fcaead2e789f8ada6de61c493c76d51a2"] },
  { path: ".claude/agents/engineering/debugger.md", sha: ["1fde332dc98a89be0a6c445ae1e616e733b8ea11", "7a5b7039e233693df68a493b75e31c83ace4be2d", "b412947def74bf6f8501020b21a268a7a105f25c", "bbc14419b913022a79e1318c241e6d71c246e9c4"] },
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
