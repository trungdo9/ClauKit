---
name: kit-builder
description: Build custom KitForge marketing-kit components - skills, agents, and workflows tailored to specific business needs.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Kit Builder

> Create custom skills, agents, and workflows to extend the KitForge marketing kit for your specific needs.

---

## What This Skill Does

**Challenge**: Every marketing team has unique processes and tools. The built-in skills in the KitForge marketing kit are great for common use cases but may not cover the specifics of each business.

**Solution**: The kit-builder skill provides a framework to create custom skills, agents, and workflows — from simple slash commands to complex multi-agent pipelines — and integrate them into the KitForge marketing kit.

---

## Activation

**Implicit**: Activates automatically when a new skill needs to be built or extended.

**Explicit**: Activate via prompt:
```
Activate kit-builder skill to create [skill/agent/workflow] for [purpose]
```

---

## Features

### 1. Anatomy of a Skill

Folder structure, SKILL.md template, and registry registration — see [references/anatomy.md](references/anatomy.md).

### 2. Build a Custom Skill

LinkedIn Content Generator example with TypeScript + Anthropic SDK + testing — see [references/custom-skill-example.md](references/custom-skill-example.md).

### 3. Build a Custom Agent

Market Research Agent example with Google ADK Python — see [references/custom-agent-example.md](references/custom-agent-example.md).

### 4. Build a Custom Workflow

Multi-step content production pipeline (YAML) with parallel steps — see [references/custom-workflow-example.md](references/custom-workflow-example.md).

### 5. Best Practices & Troubleshooting

Single responsibility, fail gracefully, document-first; common use cases and troubleshooting — see [references/best-practices.md](references/best-practices.md).

---

## Prerequisites

- KitForge marketing kit installed
- Node.js 18+ or Python 3.10+
- Anthropic API key or Google Gemini API key

---

## Usage Workflow

1. **Identify component type**: skill / agent / workflow.
2. **Read the relevant reference** in `references/` to grab the template.
3. **Write SKILL.md first** — describe purpose, activation, tools, output.
4. **Implement core logic** based on the template.
5. **Register** in `registry.json`.
6. **Test** with unit tests before deploying.

---

## Related Skills

- [Claude Code](/docs/marketing/skills/claude-code) - Install and configure environment
- [Context Engineering](/docs/marketing/skills/context-engineering) - Design agent architecture
- [Google ADK Python](/docs/marketing/skills/google-adk-python) - Python agent framework

---

## Related Commands

- `/kit-builder` - Create a new skill
- `/claude-code` - Set up Claude environment
- `/context-engineering` - Optimize agent design
