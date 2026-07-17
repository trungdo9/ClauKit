# Vault Conventions & Link Integrity

How an Obsidian vault is laid out on disk, and the mandatory procedure for renaming/moving notes without breaking links.

## What a vault is

A **vault is a folder** containing a hidden `.obsidian/` config directory at its root. Everything under it is plain files — notes are `.md`, attachments are regular binaries.

## Vault detection procedure

From a note's path, walk **up** the parent directories until one contains `.obsidian/` — that directory is the vault root. If no parent contains `.obsidian/`, the file is not in a vault: warn the user and treat it as plain markdown (skip vault-specific behavior).

## `.obsidian/` — read-only, always

**NEVER write inside `.obsidian/`** (safety rule 1). It holds plugin state, `workspace.json`, themes, and snippets; direct edits risk corrupting the vault or losing user layout/config. Reading it (e.g. to detect settings) is fine.

## Attachment folders

Settings → Files & Links → "Default location for new attachments" is one of: vault root · same folder as note · subfolder under current folder · a specified folder. Common conventions: `attachments/`, `_attachments/`, `assets/`.

Before adding an attachment, **detect the existing convention** (where do current images live? what does `.obsidian/app.json` say?) and match it — don't invent a new location.

## Daily notes

The core Daily Notes plugin writes to a configured folder with a date-format filename (default `YYYY-MM-DD.md`) and an optional template. Match the existing folder and format when creating daily notes.

## Templates

The core Templates plugin uses a `templates/` folder with placeholders `{{title}}`, `{{date}}`, `{{time}}`. (Templater plugin syntax is OUT of scope — do not emit it.)

## Filename constraints

Disallowed in note names (they break wikilinks): `/ \ : # ^ [ ] |` — plus the OS-illegal set `* " < > ?`. Avoid a leading `.` (hidden file). Prefer spaces or hyphens. Keep basenames unique across the vault where possible — Obsidian resolves links by shortest unique path, so duplicate basenames force path-qualified links.

## LINK-INTEGRITY on rename/move (MANDATORY)

The Obsidian app auto-updates links when *it* renames a file. Direct file edits by an agent do **not** trigger that — so do it manually, every time:

1. Before renaming `Old Name.md` → `New Name.md`, sweep the **whole vault** for the bare note name, then classify each hit. Grepping the basename alone catches every form — including **path-qualified** links (`[[folder/Old Name]]`, `](notes/Old%20Name.md)`) that a `[[Old Name` prefix pattern would miss:

   ```bash
   grep -rn "Old Name" <vault-root>
   ```

   Each hit is one of these reference forms (all must be updated):

   | Form | Example |
   |---|---|
   | plain wikilink | `[[Old Name]]` or path-qualified `[[folder/Old Name]]` |
   | aliased | `[[Old Name\|Display]]` |
   | heading / block link | `[[Old Name#Heading]]`, `[[Old Name#^id]]` |
   | embed | `![[Old Name]]`, `![[Old Name#...]]` |
   | markdown-style (if the vault uses them) | `](Old Name.md)`, `](notes/Old%20Name.md)` |

   (Obsidian's link format — shortest-path vs. relative/absolute — is set in Settings → Files & Links → "New link format"; the bare-name sweep is agnostic to it.)

2. Update **every** matching link to the new name, preserving any `folder/` path prefix and any `|alias`, `#heading`, or `^block` suffix. Ignore incidental prose hits that are not links.
3. Zero matches → safe to rename. If any match is ambiguous (duplicate basenames, unclear target) → **STOP and WARN** the user with a file+line list. Do not guess.
4. Moving a note between folders: basename wikilinks usually still resolve. But if duplicate basenames exist in the vault, verify each link and adjust to a path-qualified form where needed.

## New-note placement

Infer placement from where similar notes live; respect the existing folder structure. Don't dump new notes at the vault root unless that is demonstrably the vault's convention.
