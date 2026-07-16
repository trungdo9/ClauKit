---
name: context-engineering
description: Design, debug, and optimize AI agent systems when context limits hinder performance — diagnose context degradation, apply Write/Select/Compress/Isolate strategies, and build multi-agent architectures that maximize reasoning quality per token.
category: AI Agent Design
status: active
---

# Context Engineering

## Purpose

Context engineering is the discipline of **deliberately shaping what an agent sees**. Act as the agent's context budget manager: track usage, detect degradation, and guide toward architectures that maximize reasoning quality per token spent.

Broader than prompt engineering — the prompt is one slice. Distinct from `[[sequential-thinking]]` (reasoning method) and `[[problem-solving]]` (general technique).

## When to Activate

- Designing or debugging an agent system
- Context limits hindering performance (truncation, rate limits, errors)
- Optimizing cost or latency
- Building multi-agent coordination
- Implementing memory systems (cross-session, knowledge graphs)
- Evaluating agent performance
- Developing LLM-powered pipelines

Activation phrases: *"context engineering for..."*, *"how much context am I using?"*, *"reduce token waste"*, *"why does my agent fail on large files?"*, *"design multi-agent architecture"*

## Core Principles

1. **Quality > quantity** — high-signal tokens beat full content.
2. **Attention is finite** — U-shaped curve favors start and end; middle decays ("lost-in-middle").
3. **Progressive disclosure** — load info just-in-time, not pre-emptively.
4. **Isolation prevents degradation** — partition work via sub-agents.
5. **Measure before optimize** — know your baseline.

## The Four Buckets (canonical strategy)

| Bucket | Action | Tools |
|---|---|---|
| **Write** | Save context *out* of the window | Scratchpads, files, plan docs, external memory |
| **Select** | Pull only relevant context *in* | Retrieval (RAG), filtering, re-ranking, query routing |
| **Compress** | Reduce tokens while preserving info | Summarization, masking, structured recap, lossy dedup |
| **Isolate** | Split work across sub-contexts | Sub-agents, task partitioning, ephemeral workers |

Most real optimizations combine all four. Start with **Compress + Isolate** for runaway sessions; **Select + Write** for noisy retrieval.

## The Six Layers (descriptive model)

What actually enters the window:

1. **System rules** — durable identity (`CLAUDE.md`, persona).
2. **Memory** — long-lived facts pulled by relevance.
3. **Retrieved docs** — RAG output, re-ranked per query.
4. **Tool schemas** — every definition costs tokens on every turn.
5. **Conversation history** — usually the largest layer.
6. **Task** — immediate user message.

Default failure mode: layers 5 and 4 bloat unchecked. Optimization starts there.

## Degradation Patterns

| Pattern | Symptom | Fix |
|---|---|---|
| **Lost-in-middle** | Agent ignores info in middle of long context | Reorder: put critical info at start or end; shorten middle |
| **Poisoning** | One bad turn corrupts all later turns | Compact aggressively; reset on detected drift |
| **Distraction** | Irrelevant retrieved chunks pull reasoning off-target | Re-rank with cross-encoder; tighten retrieval scope |
| **Context rot** | Quality degrades monotonically over a long session | Sub-agent for new tasks; archive old turns to scratchpad |
| **Tool overload** | Wrong tool chosen from 50+ schemas | Lazy-load, hierarchical tools, per-phase tool sets |

## Key Metrics & Thresholds

- **Token utilization**: warn at **70%** of window, trigger optimization at **80%**
- **Token variance** across sessions: explains ~**80%** of agent-performance variance — i.e., context shape matters more than model choice within a tier
- **Multi-agent cost**: budget **~15x** baseline single-agent (parallel fan-out + coordination overhead)
- **Compaction target**: reduce **50–70%** of history tokens, losing **<5%** quality
- **Cache hit rate**: target **70%+** for stable workloads (Anthropic prompt cache: 5-min TTL)

## Optimization Workflow

When tuning an existing agent:

1. **Measure** input tokens by layer for 10 representative sessions.
2. **Isolate** if quality is the bottleneck — spawn sub-agents for orthogonal sub-tasks (see `[[team]]`).
3. **Prune tools** — biggest single-layer win, lowest risk.
4. **Compress history** at a fixed turn threshold (summarize after turn ~20).
5. **Re-rank retrieval** — top-K → top-50 + cross-encoder → top-5.
6. **Write memory out** — move static rules from system prompt to retrievable docs.
7. **Stabilize cache** — keep the prefix of context byte-identical across turns.

Re-measure after each change; revert if quality drops.

## Anti-Patterns

- **Kitchen-sink system prompt**: every rule in system message. Fix: retrievable docs.
- **Tool soup**: 50+ tools always loaded. Fix: lazy loading, sub-agent delegation.
- **Append-only history**: never compacting. Fix: scheduled summarization.
- **Static top-K RAG**: no re-ranking. Fix: cross-encoder pass.
- **No layer budget**: each layer grows unbounded. Fix: per-layer token caps enforced in the orchestrator.
- **Optimize blind**: tuning without measurement. Fix: instrument first, change second.

## References

See `references/`:
- `anthropic-effective-context-engineering.md` — Anthropic 6-layer framework
- `langchain-four-bucket-strategy.md` — Write/Select/Compress/Isolate canonical model
- `neo4j-context-vs-prompt.md` — discipline definition & graph-as-substrate
- `mem0-context-engineering-guide.md` — practical memory + RAG patterns

## Cross-links

`[[sequential-thinking]]`, `[[problem-solving]]`, `[[research]]`, `[[team]]`, `[[gkg]]` (graph-as-context substrate)
