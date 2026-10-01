---
name: ck-graphify
description: Build a queryable graph of a codebase from its AST — symbols, imports, call edges, dependency cycles — to support navigation, impact analysis, and refactoring at scale.
category: Codebase Analysis
status: active
---

# Ck Graphify

## Purpose

Convert a codebase into a **queryable graph**: nodes are symbols (files, modules, functions, classes), edges are imports, calls, and inheritance. Used for impact analysis, cycle detection, and large-repo navigation.

Distinct from:
- `[[gkg]]` — semantic knowledge graph from prose/docs (entities + relations from NLP). Different input domain.

**When NOT to use this skill** → write a static diagram (Mermaid / GraphViz) directly for docs; use `[[gkg]]` for extracting knowledge from specs.

## When to Use

- Repo is large enough that "grep + read" stops scaling (>50k LOC)
- Need to answer "what calls this function?" across many files
- Detecting circular imports before they become production bugs
- Estimating blast radius of a refactor (which files change if I rename X?)
- Building a tool that needs structured code understanding

Activation phrases: *"analyze codebase as a graph"*, *"find all call chains from..."*, *"detect circular dependencies"*, *"impact analysis for refactor"*

## Workflow

1. **Parse** — convert source files to ASTs. One parser per language:
   - JS/TS → Babel parser or tree-sitter
   - Python → built-in `ast` module
   - Multi-language → tree-sitter (uniform AST API)
2. **Extract** — walk ASTs to emit nodes (definitions) and edges (uses):
   - Node: `{id, type: file|module|fn|class, name, file, line}`
   - Edge: `{from, to, type: imports|calls|extends, file, line}`
3. **Index** — write to a graph store. Options:
   - **JSON property graph** — simplest; load into memory for query
   - **SQLite with WITH RECURSIVE** — middle ground; persists, queries with SQL
   - **Neo4j / Memgraph** — full graph DB; Cypher queries for serious analysis
4. **Query** — answer questions:
   - Reachability: `nodes reachable from X via calls`
   - Coupling: `nodes with in-degree > threshold`
   - Cycles: strongly connected components in the imports edge set
   - Surface: `nodes with no incoming edges` (dead code candidates)
5. **Render** (optional) — emit query results as Mermaid or GraphViz `dot` for a diagram.

## Tool Choices

| Tool | Strength | Use when |
|---|---|---|
| **tree-sitter** | Language-agnostic, incremental | Multi-language repos |
| **Babel parser** | JS/TS-native, plugin ecosystem | JS/TS-only repos |
| **Python `ast`** | Stdlib, no install | Python projects |
| **dependency-cruiser** | Pre-built JS/TS cycle + complexity reports | JS/TS, want answers not framework |
| **Sourcetrail / Sourcegraph** | Heavyweight, multi-lang, UI | Enterprise codebases |

## Common Pitfalls

- **Dynamic dispatch invisibility**: graph captures static calls; `obj[method]()` or eval-style indirection won't show. Document this in your output.
- **Generated code**: include or exclude consistently; mixed treatment produces phantom edges.
- **Test/source separation**: graph the production code separately from tests, or mark edge type, or you'll get noisy "every test calls every util" coupling metrics.
- **Stale graph**: re-parse on every commit affecting tracked extensions; tree-sitter's incremental mode helps.
- **Identifier collisions**: two functions named `parse` in different modules collapse into one node if you key only by name. Always key by `(file, line, name)`.

## Example Query Set

Once a graph is indexed, these queries are typical first-mile uses:

- `callers(fn_id)` — who calls this function (refactor impact)
- `cycles(edge_type='imports')` — circular dependencies
- `unused()` — symbols with in-degree 0 across calls and exports (dead-code candidates)
- `coupling(file)` — in/out degree distribution per file (high-coupling outliers)
- `path(from, to)` — shortest call-chain between two symbols (bug-flow tracing)

## References

See `references/`:
- `tree-sitter.md` — incremental multi-language parser
- `dependency-cruiser.md` — JS/TS dep analysis with cycle detection
- `python-ast-module.md` — stdlib AST for Python

## Cross-links

`[[gkg]]` (semantic graphs), `[[code-review]]`, `[[debugging]]`
