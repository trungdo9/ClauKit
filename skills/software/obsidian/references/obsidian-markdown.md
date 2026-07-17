# Obsidian-Flavored Markdown

Syntax reference for authoring notes. Everything below operates on plain `.md` text — write it with normal file tools.

## Internal links (wikilinks)

```markdown
[[Note Name]]                      Link by note name (extension omitted)
[[Note Name|Display Text]]        Aliased display text
[[Note Name#Heading]]              Link to a heading
[[Note Name#Heading#Subheading]]   Nested heading path
[[Note Name#^block-id]]            Link to a block
[[#Heading]]                       Heading in the SAME note
[[#^block-id]]                     Block in the SAME note
```

Markdown-style alternative (when the vault uses standard links):

```markdown
[text](Note%20Name.md)
[text](<Note Name.md>)
```

Which style a vault uses is controlled by Settings → Files & Links → "Use [[Wikilinks]]". Detect the existing style in neighboring notes and match it.

## Embeds (transclusion)

Prefix any link with `!` to embed the target inline:

```markdown
![[Note Name]]                Whole note
![[Note Name#Heading]]        One section
![[Note Name#^block-id]]      One block
![[image.png]]                Image
![[image.png|200]]            Image at width 200
![[image.png|200x100]]        Image at 200×100 (W×H)
![[document.pdf#page=3]]      Specific PDF page
```

## Block references (`^block-id`)

- Append `^my-id` at the **end** of a paragraph — or at the end of a list item's own line to tag that item.
- IDs may contain letters, numbers, and hyphens only.
- Typing `^` in Obsidian's link autocomplete generates a random id (e.g. `^a1b2c3`) — hand-written ids are equally valid.

```markdown
This paragraph can be referenced elsewhere. ^quarterly-goal

See [[Planning#^quarterly-goal]] — or embed it: ![[Planning#^quarterly-goal]]
```

## Callouts

Blockquote plus a `[!type]` marker on the first line:

```markdown
> [!note]
> Body line.

> [!warning] Custom Title
> Body.

> [!tip]- Collapsed by default
> Body (foldable: `-` starts collapsed, `+` starts expanded).
```

Recognized types (aliases share a style): `note`, `abstract`/`summary`/`tldr`, `info`, `todo`, `tip`/`hint`/`important`, `success`/`check`/`done`, `question`/`help`/`faq`, `warning`/`caution`/`attention`, `failure`/`fail`/`missing`, `danger`/`error`, `bug`, `example`, `quote`/`cite`.

Nest callouts by adding an extra `>` per level:

```markdown
> [!question] Outer
> > [!todo] Inner
> > Nested body.
```

## Tags

```markdown
Inline anywhere in the body: #project #parent/child
```

Rules:

- Must contain at least one non-numeric character — `#2024` alone is invalid, `#v2024` is valid.
- No spaces. Allowed characters: alphanumeric plus `_`, `-`, `/` (for nesting).
- Matching is case-insensitive; display preserves the case you typed.
- Frontmatter tags live under the `tags:` property **without** `#` — see `frontmatter-properties.md`.

## Comments

Not rendered in reading view or on export:

```markdown
Visible text %%inline comment%% more visible text.

%%
Multi-line block comment.
Never rendered.
%%
```

## Highlight

```markdown
==highlighted text==
```

## Standard markdown

All of GFM also works — bold `**`, italic `*`, strikethrough `~~`, task lists `- [ ]`/`- [x]`, tables, footnotes `[^1]`. Use it as normal; only the constructs above are Obsidian-specific.
