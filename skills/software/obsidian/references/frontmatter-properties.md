# Frontmatter Properties

Typed YAML metadata at the top of a note. Obsidian 1.4+ calls these **Properties** and assigns each a type.

## What / where

- A YAML block fenced by `---` lines, starting at the **very first line** of the file.
- Obsidian reads only the **first** frontmatter block; keep exactly one.

## Property types

| Type | Example value |
|---|---|
| Text | `author: Jane` |
| List | `tags: [a, b]` or block list |
| Number | `priority: 3` |
| Checkbox (bool) | `done: false` |
| Date | `created: 2026-07-17` (`YYYY-MM-DD`) |
| Date & time | `reviewed: 2026-07-17T09:30:00` (`YYYY-MM-DDThh:mm:ss`) |

## Recognized / special properties

| Key | Meaning | Format |
|---|---|---|
| `tags` | note tags (no `#` prefix) | list or inline `[a, b]` |
| `aliases` | alternative names; `[[alias]]` resolves to this note | list |
| `cssclasses` | CSS classes applied to the note view (1.4+ name; legacy key = `cssclass`) | list |
| `publish` | include in Obsidian Publish | bool |

## Example block

```yaml
---
aliases: [Meeting Notes, Standup]
tags:
  - project/atlas
  - wip
cssclasses: [wide-table]
created: 2026-07-17
reviewed: 2026-07-17T09:30:00
priority: 3
done: false
related:
  - "[[Project Atlas]]"
---
```

Notes:

- A list property may hold quoted wikilinks — `"[[Note]]"` — which render as links in the Properties view.
- Frontmatter tags take **no** `#` prefix (unlike inline body tags).

## MERGE RULE (MANDATORY)

Never blind-overwrite a frontmatter block. When adding or changing properties:

1. If the note already has a frontmatter block, **PARSE it first**.
2. Add/update **only** the intended keys; KEEP all existing keys, their values, and their order.
3. Preserve user comments and formatting where feasible; never replace the whole block wholesale.
4. If no frontmatter exists, prepend a new `---` block as the first lines of the file.

## Pitfalls

- `position` is a reserved internal key — never set it.
- No leading/trailing spaces in property names.
- Keep a single frontmatter block only — Obsidian ignores any block after the first.
