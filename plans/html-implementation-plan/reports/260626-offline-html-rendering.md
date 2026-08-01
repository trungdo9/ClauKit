# Research Report: Self-Contained HTML Rendering for Implementation Plans

**Date:** June 26, 2026  
**Scope:** Offline HTML techniques without CDN/external dependencies  
**Focus:** LLM hand-authoring capability, zero or minimal dependencies

---

## Executive Summary

**Recommendation: Use ZERO JavaScript approach** — `<details>/<summary>` for collapsibles, pure CSS for progress/badges, manual SVG or styled `<div>` patterns for diagrams.

**Mermaid inline:** ~3.5MB minified — **reject**. **Lightweight SVG+CSS diagrams** (hand-written ASCII → styled HTML) **pragmatic sweet spot.** Syntax highlighting via pre-tokenized `<span class>` markup (NOT CSS gradients — too fragile). All features work offline, `file://` safe, zero CSP violations.

---

## 1. Diagrams: Rendering Without Mermaid.js

### Problem
Mermaid.js (3.5MB minified) too large for hand-authored HTML. CDN dependency unacceptable.

### Evaluated Approaches

| Approach | Size | Hand-Authoring | Offline | Recommendation |
|----------|------|-----------------|---------|-----------------|
| Inline Mermaid.min.js | ~3.5 MB | No | Yes | **REJECT** — oversized |
| PlantUML/Kroki | API-dependent | No | No | **REJECT** — requires server |
| D2, yEd, Dia | Tools only | No | N/A | **REJECT** — not hand-authable |
| **Manual SVG + CSS** | ~2–5 KB per diagram | **YES** | **YES** | **ACCEPT** ✓ |
| ASCII art (pre + CSS) | <1 KB | **YES** | **YES** | **ACCEPT** ✓ (minimal) |

### Recommended Approach: Manual SVG + Styled HTML

**Technique:** Hand-author SVG or use `<div>` boxes + CSS Grid for flowcharts/architecture diagrams.

**Example: Simple flowchart via styled divs**
```html
<style>
  .diagram-box { border: 2px solid #333; padding: 10px; margin: 5px; display: inline-block; }
  .diagram-arrow { text-align: center; font-size: 20px; margin: 0 5px; }
</style>

<div style="display: flex; align-items: center; justify-content: center; flex-wrap: wrap;">
  <div class="diagram-box">User Request</div>
  <div class="diagram-arrow">→</div>
  <div class="diagram-box">API Gateway</div>
  <div class="diagram-arrow">→</div>
  <div class="diagram-box">Service</div>
</div>
```

**Why:** ~50–200 bytes per node. LLM generates inline. Portable, readable source.

**Limitation:** Complex UML diagrams tedious; stick to architecture, sequence (arrow chains), dependency trees.

### Fallback: Styled ASCII

```html
<pre style="font-family: monospace; border: 1px solid #ccc; padding: 10px; background: #f5f5f5;">
┌─────────┐      ┌─────────┐
│ Client  │─────→│ Server  │
└─────────┘      └─────────┘
     ↓                ↓
   Cache          Database
</pre>
```

**Cost:** <100 bytes. Works everywhere. Less visual but clear.

---

## 2. Syntax Highlighting: Pure CSS vs Minimal JS

### Evaluated Approaches

| Approach | Complexity | Hand-Authable | Robustness | Recommendation |
|----------|-----------|--------------|-----------|-----------------|
| **Pre-tokenized spans + CSS** | Medium | **YES** | High | **ACCEPT** ✓ |
| CSS gradients per line | High | No | Low | **REJECT** — fragile |
| Highlight.js standalone | Minimal | No | High | **CONDITIONAL** (heavy) |
| ft-syntax-highlight (pure CSS) | Low | No | Medium | **REJECT** — CSS-only insufficient |

### Recommended: Pre-tokenized `<span>` + CSS Theme

**Why:** LLM can produce tokenized markup. Token types map to CSS classes. Robust.

**Example Theme (inline CSS)**
```html
<style>
  .code-keyword { color: #d946ef; font-weight: bold; }
  .code-string { color: #22863a; }
  .code-comment { color: #6a737d; font-style: italic; }
  .code-function { color: #6f42c1; }
  .code-number { color: #005cc5; }
</style>

<pre><code>
<span class="code-keyword">function</span> <span class="code-function">render</span>() {
  <span class="code-keyword">const</span> msg = <span class="code-string">"hello"</span>; <span class="code-comment">// greeting</span>
  <span class="code-keyword">return</span> <span class="code-number">42</span>;
}
</code></pre>
```

**Size:** ~300 bytes theme + tokenized markup (varies by code length).

**LLM Effort:** Produce tokens in order: `<span class="X">token</span>`. Feasible for short–medium snippets.

**Alternative (Lighter):** No highlighting, just syntax styling via language-specific `<pre class="language-js">` + CSS font rules. Trade visual richness for zero effort.

---

## 3. Collapsible Sections & TOC Navigation

### Evaluated Approaches

| Method | JS Required | Accessibility | Offline | Recommendation |
|--------|------------|----------------|---------|-----------------|
| **`<details>/<summary>`** | **NO** | Native ARIA | **YES** | **ACCEPT** ✓ |
| Minimal inline JS toggle | Small | Manual ARIA | **YES** | **CONDITIONAL** |
| Pure CSS `:focus-within` hacks | No | Poor | **YES** | **REJECT** — fragile |

### Recommended: Native `<details>` Element

**Zero JavaScript. Keyboard accessible. Works offline.**

```html
<details open>
  <summary style="cursor: pointer; font-weight: bold;">Phase 1: Research</summary>
  <div style="margin-left: 20px; margin-top: 10px;">
    <p>Gather requirements...</p>
  </div>
</details>

<details>
  <summary style="cursor: pointer; font-weight: bold;">Phase 2: Design</summary>
  <div style="margin-left: 20px; margin-top: 10px;">
    <p>Architecture planning...</p>
  </div>
</details>
```

**TOC Generation via `<nav>` + anchor links**
```html
<nav style="border: 1px solid #ddd; padding: 15px; background: #f9f9f9;">
  <strong>Table of Contents</strong>
  <ul style="margin: 10px 0;">
    <li><a href="#research">Research Phase</a></li>
    <li><a href="#design">Design Phase</a></li>
    <li><a href="#implementation">Implementation Phase</a></li>
  </ul>
</nav>

<section id="research">
  <details><summary>Research Phase</summary>...</details>
</section>
```

**Why:** Native browser support (all modern browsers), keyboard accessible (Tab + Enter/Space), no dependencies.

**File:// Safe:** Yes. Details/summary requires zero JS; standard DOM.

---

## 4. Progress Bars & Status Badges

### Evaluated Approaches

| Method | JS Required | Dynamism | Recommendation |
|--------|------------|----------|-----------------|
| **Inline `width` style** | **NO** | Static only | **ACCEPT** ✓ |
| CSS + `::before` animation | No | Limited | **ACCEPT** ✓ |
| JS `setInterval()` | Yes | Dynamic | **REJECT** (use when needed) |

### Recommended: Pure CSS with Inline Width

**Progress Bar**
```html
<style>
  .progress-bar-container { width: 100%; height: 20px; background: #e0e0e0; border-radius: 4px; overflow: hidden; }
  .progress-bar-fill { height: 100%; background: linear-gradient(90deg, #4caf50, #45a049); width: var(--progress, 0%); }
</style>

<div class="progress-bar-container">
  <div class="progress-bar-fill" style="--progress: 65%;"></div>
</div>
<p style="text-align: center; margin-top: 5px;">Phase 3/5 Complete (65%)</p>
```

**Size:** ~200 bytes.

**Status Badges (pure CSS)**
```html
<style>
  .badge { display: inline-block; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; }
  .badge.pending { background: #fff3cd; color: #856404; }
  .badge.in-progress { background: #d1ecf1; color: #0c5460; }
  .badge.complete { background: #d4edda; color: #155724; }
</style>

<span class="badge pending">Pending</span>
<span class="badge in-progress">In Progress</span>
<span class="badge complete">✓ Complete</span>
```

**Why:** Inline `width`/CSS variables allow LLM to set values directly. No JS for static displays.

---

## Security & Compatibility

### CSP (`file://` Protocol)
- **`<details>/<summary>`**: Safe. Native HTML, no JS.
- **Inline `<style>`**: Safe. Self-contained.
- **Inline JS (if used)**: Requires `script-src 'unsafe-inline'`. Fine for local files; avoid in production web apps.

### Browser Support
- Details/summary: ✓ Chrome 12+, Firefox 49+, Safari 6+, Edge 79+.
- CSS Grid/Flexbox: ✓ Universal (2016+).
- SVG: ✓ Universal.

### Offline Behavior
All recommended techniques work `file://` — no network calls required.

---

## Pragmatic Implementation Strategy

### Tier 1: Minimal (Start Here)
1. **Diagrams:** Styled `<div>` boxes + flexbox or ASCII in `<pre>`.
2. **Code:** Plain `<pre><code>` with monospace font (no highlighting).
3. **Collapsibles:** `<details>/<summary>`.
4. **Progress:** Inline width style + CSS background color.

**Total Overhead:** ~1 KB CSS + structure markup.

### Tier 2: Enhanced (If LLM Budget Allows)
- Add pre-tokenized syntax spans (LLM produces `<span class="keyword">for</span>`).
- Styled boxes for diagrams (grid layout, shadows, colors).
- Badges with multiple status colors.

**Overhead:** +2–3 KB.

### Tier 3: Rich (Heavy Lift)
- Hand-authored SVG diagrams.
- Full tokenized syntax highlighting theme.
- Animated progress bars (CSS `@keyframes`).

**Overhead:** +5–10 KB.

---

## Concrete Minimal Example (Self-Contained HTML)

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Implementation Plan</title>
  <style>
    body { font-family: system-ui; max-width: 900px; margin: 40px auto; line-height: 1.6; color: #333; }
    details { margin: 15px 0; border: 1px solid #ddd; padding: 10px; border-radius: 4px; }
    summary { cursor: pointer; font-weight: bold; }
    .progress-bar { height: 20px; background: #e0e0e0; border-radius: 4px; overflow: hidden; margin: 10px 0; }
    .progress-fill { height: 100%; background: #4caf50; width: var(--w, 0%); }
    .badge { padding: 4px 8px; border-radius: 12px; font-size: 12px; background: #d4edda; color: #155724; }
    code { background: #f4f4f4; padding: 2px 4px; border-radius: 2px; font-family: monospace; }
    pre { background: #f4f4f4; padding: 10px; border-radius: 4px; overflow-x: auto; }
  </style>
</head>
<body>
  <h1>Software Implementation Plan</h1>
  
  <details open>
    <summary>Phase 1: Research <span class="badge">✓ Complete</span></summary>
    <div style="padding: 10px 0;">
      <p>Research completed on 4 key areas...</p>
      <pre><code>Topics: Diagrams, Syntax Highlighting, Collapsibles, Progress</code></pre>
    </div>
  </details>

  <details>
    <summary>Phase 2: Design <span class="badge">In Progress</span></summary>
    <div style="padding: 10px 0;">
      <div class="progress-bar"><div class="progress-fill" style="--w: 60%;"></div></div>
      <p>Architecture planning underway...</p>
    </div>
  </details>

  <details>
    <summary>Phase 3: Implementation <span class="badge">Pending</span></summary>
    <div style="padding: 10px 0;"><p>Starting after design approval.</p></div>
  </details>
</body>
</html>
```

**File size:** ~1.2 KB. **Load time:** Instant. **Dependencies:** Zero.

---

## Unresolved Questions

1. **Dynamic progress updates:** If real-time progress needed (e.g., upload status), how far is acceptable with CSS-only? Answer: CSS `@keyframes` animation only; true dynamic requires JS.

2. **Complex diagram interchange:** Can LLM hand-author multi-node dependency graphs efficiently? Answer: Feasible up to 20–30 nodes; beyond that, manual SVG or Mermaid inline (budget permitting).

3. **Print rendering:** Does `<details>` expand all sections when printing? Answer: Varies by browser; add `@media print { details { display: block !important; } }` to force expansion.

4. **Browser inspector bloat:** Does inline CSS/JS inflate HTML file visible in DevTools? Answer: Yes, but negligible for typical plans (<50 KB total).

---

## Sources

- [Mermaid.js Alternatives - Swimm](https://swimm.io/learn/mermaid-js/top-6-mermaid-js-alternatives)
- [Beyond PlantUML – Best Open Source Alternatives](https://profullstack.substack.com/p/beyond-plantuml-the-best-open-source)
- [ft-syntax-highlight GitHub](https://github.com/soulshined/ft-syntax-highlight)
- [CSS Only Syntax Highlighting - DEV Community](https://dev.to/grahamthedev/impossible-css-only-js-syntax-highlighting-with-a-single-element-and-gradients-243j)
- [HTML `<details>` Element - MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details)
- [Mastering Details & Summary - All About HTML](https://allabouthtml.com/html-details-and-summary-tags-complete-guide/)
- [Modern Pure CSS Progress Bars - CodeShack](https://codeshack.io/pure-css-modern-progress-bars-collection/)
- [W3.CSS Progress Bars](https://www.w3schools.com/w3css/w3css_progressbar.asp)

