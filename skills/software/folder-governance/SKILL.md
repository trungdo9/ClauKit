---
name: folder-governance
description: Automated workspace folder organization, hierarchy enforcement, campaign packaging audit, and continuous structural improvement for example.com.
category: Codebase Hygiene & Marketing Architecture
status: active
---

# Folder Governance & Kaizen Architecture Skill

## Purpose

Enforce strict directory boundaries, distinguish between long-term operational plans (`plans/marketing/`) and time-bound actionable campaigns (`plans/campaigns/`), eliminate loose files, and automate continuous structural improvement across the workspace.

---

## When to Use

1. When creating new marketing plans, SEO campaigns, sprint checklists, or reports.
2. When reorganizing files to prevent structural clutter.
3. Before committing changes to verify that no loose files or broken campaign packages exist.
4. Activation commands/phrases: *"audit folder structure"*, *"check folder governance"*, *"organize plans and campaigns"*.

---

## Core Execution Tools & Scripts

### 1. Run Automated Folder Governance Audit
```bash
node scripts/audit-folder-governance.js
```
- **Checks performed**:
  1. `plans/marketing/`: Verifies zero loose files (only `README.md` and functional subdirectories).
  2. `plans/`: Verifies only `README.md` and `marketing-context.md` exist at root.
  3. `plans/campaigns/`: Ensures 100% of campaign subdirectories contain both `master-campaign-plan.md` and `action-checklist.md`.
  4. `wiki/drafts/`: Verifies draft lifecycle compliance.

---

## Directory Hierarchy & Rules

```
example.com/
├── plans/
│   ├── README.md                          # Master directory specification
│   ├── marketing-context.md               # Master strategic context (ICP, Brand, Competitors)
│   ├── multi-site-enterprise-architecture.md # Master Multi-Site Hub-and-Spoke Blueprint
│   ├── marketing/                         # Long-term frameworks, Ops, CRM, Reports, Audits
│   │   ├── seo-content/                   # Keyword maps, content taxonomies
│   │   ├── seo-audit/                     # 213 URLs audit dashboards
│   │   ├── crm/                           # Customer segments & MISA AMIS CRM integration
│   │   └── reports/                       # SERP Robot, GSC, Indexing reports
│   └── campaigns/                         # Actionable, time-bound campaigns with tenant prefixes
│       ├── README.md                      # Campaign index & standards
│       ├── tht-<campaign-slug>/           # example.com campaigns
│       ├── mtxv-<campaign-slug>/          # example.org campaigns
│       ├── vll-<campaign-slug>/           # example.net campaigns
│       └── global-<campaign-slug>/        # Cross-site / Enterprise campaigns
│           ├── master-campaign-plan.md    # Strategy, KPIs, Silo tiers, Timeline
│           └── action-checklist.md        # Task-by-task checklist with IDs & checkboxes
```

---

## Tenant Prefix Conventions

| Prefix | Target Site | Description | Example |
|:---:|---|---|---|
| `tht-` | `example.com` | B2B Activated Carbon & Filter Media Wholesale | `example.com/pillars/p1-than-hoat-tinh/` |
| `mtxv-` | `example.org` | Environmental Services, EPC & Wastewater/Air Systems | `example.org/projects/website-growth/` |
| `vll-` | `example.net` | Water Filtration Media, Sand, Gravel, Resins & PAC | `example.net/pillars/p2-vat-lieu-loc/` |
| `global-` | `All Sites` | Corporate Master Data Lake CRM, Global Email Automation | `global/email-marketing/` |

---

## Kaizen Continuous Improvement Protocol

- **Strict Tenant Prefixes**: Every new campaign directory MUST start with `tht-`, `mtxv-`, `vll-`, or `global-`.
- **Never create loose campaign files** in `plans/marketing/` or `plans/`.
- **Always package a new campaign** into `plans/campaigns/<prefix>-<campaign-name>/` with both `master-campaign-plan.md` and `action-checklist.md`.
- **Update indexes**: Always update `plans/campaigns/README.md` and `plans/README.md` when launching a new campaign.
- **Run audit**: Run `node scripts/audit-folder-governance.js` to ensure 100% compliance.
