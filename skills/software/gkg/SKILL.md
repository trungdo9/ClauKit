---
name: gkg
description: Build a semantic knowledge graph from unstructured text — design docs, RFCs, ADRs, transcripts — extracting entities and relations for queryable, RAG-friendly knowledge.
category: Knowledge & Search
status: active
---

# Gkg

## Purpose

Convert prose into a **semantic knowledge graph**: nodes are concepts (services, people, decisions, components), edges are relations (depends-on, owns, supersedes). The output is queryable and feeds retrieval-augmented agents.

Distinct from:
- `[[ck-graphify]]` — syntactic code graph (AST, calls, imports). Different input (source code), different node types.

**When NOT to use this skill** → use `[[ck-graphify]]` for code structure; write a static diagram (Mermaid / GraphViz) directly for docs.

## When to Use

- Repo has dozens of design docs, RFCs, ADRs, post-mortems — and finding the right one takes hours
- Building a domain-aware RAG: retrieval should follow relations, not just text similarity
- Need to answer questions like "what depends on service X according to the docs?" without re-reading everything
- Onboarding: turn a year of decisions into a graph a new hire can browse

Activation phrases: *"extract knowledge from these docs"*, *"build a semantic graph from..."*, *"convert design docs to KG"*, *"semantic search over our specs"*

## Workflow

1. **Source** — corpus selection. Design docs, RFCs, ADRs, post-mortems, meeting notes. Keep code out (that's `[[ck-graphify]]`'s job).
2. **Extract** — pull entities and relations:
   - **LLM extraction** — prompt with a schema; fast iteration; cost scales per document.
   - **Rule-based / spaCy** — fast, cheap, deterministic; brittle on prose variation.
   - **Hybrid** — rules for common cases, LLM for ambiguous; best practical balance.
3. **Schema** — define node types (Service, Person, Decision, Component) and edge types (depends-on, owns, decided-by, supersedes) up front. Schemas drift; review quarterly.
4. **Store** — pick by query needs:
   - **JSON property graph** — small corpora (<10k nodes); load in memory.
   - **SQLite + recursive CTEs** — middle scale; persistent; familiar query language.
   - **Neo4j / Memgraph** — large scale; Cypher; visualizations.
5. **Query** — answer typical questions:
   - "What does service X depend on?" → traverse depends-on edges.
   - "Who owns the components touching DB Y?" → join owns + uses edges.
   - "What decisions superseded ADR-007?" → reverse-traverse supersedes.
6. **Integrate with RAG** — query the graph to scope retrieval: instead of "top-K similar chunks across all docs", "top-K chunks from documents about [graph-returned components]".

## Tool Choices

| Tool | Strength | Use when |
|---|---|---|
| **kg-gen** | LLM-based extraction, schema-aware | Want fast iteration on schema |
| **KGTK** | USC's full toolkit — construction, validation, query | Large multi-source graphs |
| **spaCy** | Fast NER + dependency parsing | Rule-based, cost-sensitive |
| **LangChain / LlamaIndex KG modules** | Pre-baked extraction + retrieval | Already on those stacks |

## Anti-Patterns

- **No schema discipline**: ad-hoc entity types proliferate, query gets impossible. Fix: lock the schema before extracting at scale; re-extract on schema change.
- **Pure-LLM extraction at scale**: cost and consistency both suffer. Fix: rules for high-frequency patterns, LLM for tails.
- **Graph as the only retriever**: text similarity still matters. Fix: combine graph + vector retrieval; graph narrows, vector ranks.
- **Stale graph**: docs update, graph doesn't. Fix: re-extract on doc change; treat the graph as a build artifact.
- **Boil-the-ocean schema**: defining 50 entity types upfront. Most queries use the top 5. Start with the smallest schema that answers the top 3 user questions; grow only when a query forces it.

## Minimal Example Schema

For a typical engineering org, this schema covers ~80% of common queries:

```yaml
entities: [Service, Component, Person, Decision, Document]
relations:
  - depends_on: Service → Service
  - owns: Person → (Service | Component)
  - decided_in: Decision → Document
  - supersedes: Decision → Decision
  - mentions: Document → (Service | Component | Decision)
```

Extract against this for a quarter; widen only when a query you actually need fails.

## References

See `references/`:
- `kg-gen-llm-extraction.md` — LLM-based extraction approach
- `kgtk-knowledge-graph-toolkit.md` — comprehensive KG framework
- `awesome-kg-construction-tools.md` — curated tool landscape

## Cross-links

`[[ck-graphify]]`, `[[research]]`, `[[context-engineering]]`, `[[planning]]`
