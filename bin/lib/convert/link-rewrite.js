/**
 * Rewrites this repo's `.claude/skills/...` cross-references so they still
 * point somewhere sane once the referencing file moves to a different tool's
 * directory layout.
 *
 * ClauKit's own doc-link convention (see CLAUDE.md "Repo layout ≠ installed
 * layout") writes these as `[.claude/skills/x/SKILL.md](../../skills/x/SKILL.md)`
 * — canonical display text + a real relative href. We keep that shape but:
 *   - swap the display text's `.claude/skills/` for the target tool's prefix
 *   - recompute the href's relative distance from the NEW file's location
 *
 * Only skill links are rewritten. Cross-references to `.claude/agents/`,
 * `.claude/commands/`, or `.claude/workflows/` are left as prose — those
 * concepts don't map 1:1 across tools (see convert/README notes in each
 * to-*.js), so a rewritten href would be a guess, not a fact.
 */

function rewriteSkillRefs(body, { displayPrefix, hrefBase }) {
  let out = body.split(".claude/skills/").join(displayPrefix);
  out = out.replace(/\]\(([^)]*?)(skills\/[^)]*)\)/g, (_m, _junk, tail) => {
    return `](${hrefBase}${tail.replace(/^skills\//, "")})`;
  });
  return out;
}

module.exports = { rewriteSkillRefs };
