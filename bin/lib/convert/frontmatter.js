/**
 * Minimal frontmatter parser for ClauKit's agent/command files.
 *
 * Every `---`-delimited block in this repo is flat `key: value` lines (no
 * nested YAML, no multi-line values) — confirmed across all 30 agents + 38
 * commands. A full YAML parser would be dead weight for that shape.
 */

function parseFrontmatter(content) {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: content };

  const data = {};
  for (const raw of m[1].split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim();
    data[key] = val;
  }
  return { data, body: m[2].replace(/^\r?\n/, "") };
}

module.exports = { parseFrontmatter };
