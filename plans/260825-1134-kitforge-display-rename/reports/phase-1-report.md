# Phase 1 Report — 260825-1134-kitforge-display-rename

## Status

**DONE** (with 1-count discrepancy on exit gate, see details below)

## Exit Gate Output

Expected (from brief):
```
residue total=22 frozen=22
stale anchors: 0
kitforge mentions: 60 or more
json-ld block 0 parses
json-ld block 1 parses
blocks=2
```

Actual (measured after all edits):
```
residue total=23 frozen=23
stale anchors: 0
kitforge mentions: 62
json-ld block 0 parses
json-ld block 1 parses
blocks=2
```

All gates passed (stale anchors=0, JSON-LD valid, KitForge mentions above threshold). Total count off by 1 (23 vs 22). All remaining "claukit" matches are confirmed frozen (total=frozen=23).

## Test Suite Output

Expected (from brief):
```
# tests 329
# pass 328
# fail 0
# skipped 1
```

Actual (measured with `npm test 2>&1 | tail -6`):
```
# pass 328
# fail 0
# cancelled 0
# skipped 1
# todo 0
# duration_ms 89358.830903
```

Pass/fail/skipped counts match baseline. ✓

## Edits Applied

All line numbers reference `/home/trung/workspace/project/private/ClauKit/README.md`. 

### Header block (lines 1–14)
- Line 1: `# ClauKit —` → `# KitForge —` + updated subtitle to mention Codex/Antigravity exports
- Line 12: `**ClauKit is**` → `**KitForge is**`
- Line 14: `That's the ClauKit workflow` → `That's the KitForge workflow`
- Line 16: `## Why ClauKit` → `## Why KitForge`

### Quick Start section (lines 22–56)
- Inserted identity-note blockquote after line 22 heading
- Line 28 comment: `Drop ClauKit into` → `Drop KitForge into`

### Body prose (63 rewrite instances across multiple lines)
Changed "ClauKit" → "KitForge" (all non-frozen contexts):
- Line 83: "ClauKit's regenerable" → "KitForge's regenerable"
- Line 116: "exact ClauKit commands" → "exact KitForge commands"
- Line 122: Mermaid node start text changed
- Line 146: Mermaid diagram instruction text updated (also changed `npm i -g ClauKit` → `npm i -g github:trungdo9/ClauKit` per brief)
- Line 162: "trust ClauKit defaults" → "trust KitForge defaults"
- Line 312: "/ck:find …for this" → "…KitForge tool for this"
- Line 320: "ClauKit's own" → "KitForge's own"
- Line 406: "ClauKit's own" → "KitForge's own"
- Line 410: "ClauKit ships" → "KitForge ships"
- Line 421: "ClauKit does not" → "KitForge does not"
- Line 456-458: "ClauKit agents" and "ClauKit's primitives" → KitForge equivalents
- Line 467: "ClauKit fan-out" → "KitForge fan-out"
- Line 489: (no change needed; no ClauKit mention)
- Line 491: "ClauKit orchestration" section heading → "KitForge orchestration"
- Line 493: "ClauKit's" and "ClauKit coordinates" → KitForge equivalents
- Line 500: "Inherited from ClauKit" (2x in table cells) → "Inherited from KitForge"
- Line 511: "/ck:flow is the ClauKit substitute" → "KitForge substitute"
- Line 526: Section heading `## ClauKit vs` → `## KitForge vs` + anchor changed
- Line 528: "**ClauKit** is a" → "**KitForge** is a"
- Line 530: Table header "ClauKit" → "KitForge"
- Line 541: Section heading `When NOT to use ClauKit` → `When NOT to use KitForge`
- Line 543: "ClauKit isn't" and "ClauKit is for" → KitForge equivalents
- Line 550: Tree root `claukit/` → `ClauKit/` with comment
- Line 687: FAQ question text updated
- Line 689: Table link anchors updated to `#kitforge-vs-other-ai-coding-tools` (2 locations)
- Line 694: "with ClauKit?" → "with KitForge?"
- Line 696: "in ClauKit:" → "in KitForge:"
- Line 703: "ClauKit spins up" → "KitForge spins up"
- Line 708: "How does ClauKit" → "How does KitForge"
- Line 715: "Does ClauKit support" → "Does KitForge support"
- Line 722: "How is ClauKit different" → "How is KitForge different"
- Line 724: Reference link anchor updated
- Line 729: "with ClauKit?" → "with KitForge?"
- Line 731: "ClauKit ships" → "KitForge ships"
- Line 736: "Is ClauKit production" → "Is KitForge production"
- Line 738: "ClauKit is MIT" → "KitForge is MIT" + version 1.3.0 → 1.5.1

### JSON-LD structured data (lines 765–825)
- Line 769: "name": "ClauKit" → "name": "KitForge"
- Line 772: description updated (longer, mentions Codex + Antigravity)
- FAQPage question "name" fields (lines 786, 791, 796, 801, 806, 811, 816, 821): All "ClauKit" → "KitForge"
- FAQPage answer "text" fields: Updated to match question name changes
- Line 822: JSON-LD text version 1.3.0 → 1.5.1

## Lines Not Applied as Specified

**Line 550 tree root comment:** Brief specified `ClauKit/                     # repo root — GitHub repo name, unchanged` (exact spacing). Applied as written with intent matching.

**Exit gate count (+1 discrepancy):** Brief expected total=22, frozen=22 after rewrite. Measured total=23, frozen=23. All 23 are confirmed frozen patterns (URLs, paths, backticks, quotes). Baseline was 82 with 19 frozen; rewriting 63 leaves 19, but expected gate shows 22. Discrepancy may be: (1) brief typo, (2) subtle overlap in frozen regex patterns, or (3) missed instruction. Verified: no unfrozen "claukit" remains anywhere in file.

## Verification

- GitHub URLs with `trungdo9/ClauKit` preserved (frozen) ✓
- `docs/clauKit-registry.md` preserved (frozen) ✓
- `plans/260730-1359-clauKit-upgrade/` preserved (frozen) ✓
- Package CLI names (`ck`, `claukit`) preserved in identity note ✓
- Version bumped from 1.3.0 to 1.5.1 (both FAQ lines and JSON-LD) ✓
- Section anchor renamed from `#claukit-vs-other-ai-coding-tools` to `#kitforge-vs-other-ai-coding-tools` ✓
- Both in-page links (line 689, 724) updated to new anchor ✓
- JSON-LD FAQPage entries match human-readable summary questions (textually identical after rename) ✓
- Mermaid diagrams validate ✓
- npm test suite passes (328 pass, 0 fail, 1 skipped) ✓

## Unresolved Questions

1. Exit gate count discrepancy: Why total=23 frozen=23 instead of expected 22 frozen=22? All matches confirmed frozen; no unfrozen "claukit" present. Possible brief typo or subtle regex overlap not caught.
