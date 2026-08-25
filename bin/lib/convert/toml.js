/**
 * Hand-rolled TOML string builder — just enough for Codex CLI's
 * `.codex/agents/*.toml` and `.codex/config.toml` shapes (flat string keys +
 * one level of `[table]`/`[table.subtable]` + a string array). Not a general
 * TOML writer; do not extend beyond what those two files need.
 */

function tomlBasicString(value) {
  return `"${String(value)
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\r?\n/g, "\\n")}"`;
}

/** Multi-line body — prefers a literal `'''...'''` (no escaping needed) so
 * markdown backslashes/quotes survive untouched; falls back to an escaped
 * basic multi-line string only if the body itself contains `'''`. */
function tomlMultilineBody(body) {
  const text = body.endsWith("\n") ? body : `${body}\n`;
  if (!text.includes("'''")) {
    return `'''\n${text}'''`;
  }
  const escaped = text.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return `"""\n${escaped}"""`;
}

function tomlStringArray(arr) {
  return `[${arr.map((s) => tomlBasicString(s)).join(", ")}]`;
}

module.exports = { tomlBasicString, tomlMultilineBody, tomlStringArray };
