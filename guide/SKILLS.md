# KitForge Skills Guide

This guide documents available skills in KitForge. Skills extend Claude's capabilities with specialized knowledge, workflows, and tool integrations.

## Table of Contents

- [What Are Skills?](#what-are-skills)
- [How to Use Skills](#how-to-use-skills)
- [Development Framework Skills](#development-framework-skills)
- [Design & Multimedia Skills](#design--multimedia-skills)
- [Database Skills](#database-skills)
- [Developer Tools Skills](#developer-tools-skills)

---

## What Are Skills?

Skills are specialized knowledge modules that enhance Claude's capabilities:

- **Domain expertise** - Deep knowledge in specific technologies
- **Best practices** - Industry-standard patterns
- **Practical workflows** - Step-by-step implementation guides
- **Code examples** - Ready-to-use templates

## How to Use Skills

Skills are invoked automatically based on context:

```bash
# Automatic invocation
claude "How do I implement OAuth with Better Auth?"
```

Or combine with slash commands:

```bash
/plan "implement authentication with Better Auth"
/cook "create Docker containers for the app"
/design "create a landing page with shadcn/ui"
```

---

## Development Framework Skills

### nextjs

**Next.js React framework**

**Features:**
- Server-side rendering (SSR) and static generation (SSG)
- App Router and Server Components
- API routes and middleware
- Built-in TypeScript support

---

### shadcn-ui

**Beautiful, accessible React components**

**Features:**
- 50+ customizable components
- Radix UI + Tailwind CSS
- Dark mode support
- TypeScript-first
- Fully accessible

---

### tailwindcss

**Utility-first CSS framework**

**Features:**
- Rapid UI development
- Responsive design
- Dark mode support
- JIT compilation
- Custom theme configuration

---

### turborepo

**Monorepo build system**

**Features:**
- High-performance builds
- Intelligent caching
- Task pipelines
- Parallel execution

---

### cloudflare

**Edge computing platform**

**Features:**
- Cloudflare Workers (serverless)
- D1 (edge database)
- R2 (object storage)
- KV (key-value store)

---

## Design & Multimedia Skills

### ai-multimodal

**AI image generation and analysis**

**Capabilities:**
- Generate images from text prompts
- Image analysis and vision
- Object detection
- Scene description
- Multi-image processing

**Configuration**: Requires `GEMINI_API_KEY` in `.claude/.env`

---

### chrome-devtools

**Browser automation with Puppeteer**

**Features:**
- Screenshot capture
- Performance analysis
- Network monitoring
- Web scraping
- Form automation

---

### imagemagick

**Advanced image processing**

**Features:**
- Format conversion
- Resize and crop
- Apply effects and filters
- Batch processing

---

### ffmpeg

**Multimedia framework**

**Features:**
- Video/audio encoding
- Format transcoding
- Filtering and effects
- Codec optimization

---

### threejs

**3D web experiences**

**Features:**
- Three.js scenes and cameras
- GLTF/FBX loading
- PBR materials and shaders
- Post-processing effects
- WebXR support

---

### ui-styling

**UI styling with shadcn/ui and Tailwind**

**Features:**
- Component styling
- Theming and dark mode
- Responsive layouts
- Canvas-based designs

---

## Database Skills

### mongodb

**Document database**

**Features:**
- CRUD operations
- Aggregation pipelines
- Indexing and performance
- Atlas cloud support

---

### postgresql-psql

**PostgreSQL management**

**Features:**
- SQL queries
- Database management
- Performance optimization
- psql CLI usage

---

## Developer Tools Skills

### mcp-builder

**Build Model Context Protocol servers**

**Features:**
- Create MCP servers in Python/Node.js
- Integrate external APIs
- Tool design patterns

---

### repomix

**Pack repositories into AI-friendly files**

**Features:**
- Repository packaging
- Codebase analysis
- Security audits

---

### skill-creator

**Create new Claude skills**

**Features:**
- Skill template generation
- Documentation structure
- Publishing guidelines

---

### claude-code

**Claude Code features**

**Features:**
- Agent skills
- MCP integration
- Hooks and plugins
- IDE integration

---

### sequential-thinking

**Structured problem-solving**

**Features:**
- Multi-step analysis
- Hypothesis verification
- Adaptive planning

---

## Creating Custom Skills

Create a new skill:

1. Create directory: `.claude/skills/my-skill/`
2. Add `SKILL.md` with frontmatter:

```markdown
---
name: my-skill
description: What this skill does
---

# My Skill

[Documentation content...]
```

3. Add supporting files as needed

---

## Need Help?

- **List skills**: `ls .claude/skills/`
- **View skill docs**: `cat .claude/skills/[skill-name]/SKILL.md`
- **Get help**: Ask Claude "How do I use the [skill-name] skill?"

---

**Last Updated**: 2026-01-31

Repository: https://github.com/trungdo9/ClauKit
