# Design Guidelines

**Last Updated**: 2026-07-16
**Version**: 1.3.6
**Project**: KitForge

## Overview

This document provides design guidelines, principles, and best practices for projects built with the KitForge template (`@trungdo9/ClauKit`, installed via `ck init`).

## Design Principles

### User-Centered Design

- Focus on user needs and goals
- Create intuitive interfaces
- Minimize cognitive load
- Provide clear feedback

### Visual Hierarchy

- Use size and weight to indicate importance
- Group related elements
- Use whitespace effectively
- Guide user attention

### Consistency

- Maintain visual consistency across pages
- Use consistent interaction patterns
- Follow platform conventions
- Reuse components

## UI/UX Commands

### Quick Design

```bash
/ck:design fast "Create a login page"
```

### Immersive Design

```bash
/ck:design good "Design a dashboard with charts"
```

### 3D Designs

```bash
/ck:design 3d "Create 3D product visualization"
```

### From References

```bash
/ck:design screenshot "path/to/screenshot.png"   # match reference exactly
/ck:design describe "path/to/screenshot-or-video"  # describe + hand-off plan only, no implementation
```

### UI/UX Pro Max

```bash
/ck:design ui-ux-pro-max "Create complete design system"
```

## Component Design

### Button Styles

| Style | Usage | Example |
|-------|-------|---------|
| Primary | Main actions | Submit, Save |
| Secondary | Alternative actions | Cancel |
| Destructive | Delete, Remove | Confirm delete |
| Ghost | Subtle actions | More options |

### Form Design

- Clear labels
- Helpful placeholders
- Inline validation
- Error messages with guidance

### Navigation

- Clear hierarchy
- Breadcrumbs for deep navigation
- Consistent placement
- Mobile-friendly

## Color Guidelines

### Color Palette

```css
/* Primary Colors */
--color-primary: #3b82f6;
--color-primary-hover: #2563eb;

/* Semantic Colors */
--color-success: #22c55e;
--color-warning: #f59e0b;
--color-error: #ef4444;
--color-info: #0ea5e9;

/* Neutral Colors */
--color-text: #1f2937;
--color-text-muted: #6b7280;
--color-background: #ffffff;
--color-border: #e5e7eb;
```

### Accessibility

- Minimum contrast ratio: 4.5:1
- Test with color blindness simulators
- Never use color alone for meaning

## Typography

### Font Sizes

| Size | Value | Usage |
|------|-------|-------|
| xs | 0.75rem | Captions |
| sm | 0.875rem | Body small |
| base | 1rem | Body |
| lg | 1.125rem | Body large |
| xl | 1.25rem | Headings |
| 2xl | 1.5rem | Headings |
| 3xl | 1.875rem | Page titles |

### Line Heights

- Headings: 1.2-1.3
- Body text: 1.5-1.6
- Dense text: 1.3-1.4

## Spacing System

### Base Unit: 4px

```css
/* Spacing scale */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
--space-12: 48px;
--space-16: 64px;
```

## Responsive Design

### Breakpoints

```css
/* Mobile First */
--breakpoint-sm: 640px;   /* Tablets */
--breakpoint-md: 768px;   /* Small laptops */
--breakpoint-lg: 1024px;  /* Desktops */
--breakpoint-xl: 1280px;  /* Large screens */
```

### Mobile Considerations

- Touch targets: minimum 44x44px
- Readable text: minimum 16px
- Adequate spacing between interactive elements

## Animation Guidelines

### Duration

| Type | Duration | Example |
|------|----------|---------|
| Instant | 0-50ms | Hover effects |
| Fast | 100-200ms | Tooltips |
| Normal | 200-300ms | Modal enter |
| Slow | 400-500ms | Page transitions |

### Easing

```css
/* Common easing curves */
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
```

## Accessibility Guidelines

### WCAG 2.1 AA

- Contrast ratio: 4.5:1 normal text
- Keyboard navigation support
- Focus indicators visible
- Alt text for images

### Screen Reader Support

- Semantic HTML
- ARIA labels where needed
- Logical heading structure
- Skip links for main content

## Design Tools Integration

### Figma

- Use components and variants
- Document design tokens
- Create interactive prototypes

### Design Tokens

Export design tokens for code:

```json
{
  "colors": {
    "primary": { "value": "#3b82f6" },
    "success": { "value": "#22c55e" }
  },
  "spacing": {
    "unit": { "value": "4px" }
  }
}
```

## Content Design

### Writing Guidelines

- Use active voice
- Be concise
- Use consistent terminology
- Avoid jargon

### Error Messages

- Be specific
- Provide solutions
- Use friendly tone
- Avoid technical jargon

## Design Review Checklist

- [ ] Accessibility requirements met
- [ ] Responsive design verified
- [ ] Design tokens applied consistently
- [ ] Interaction patterns documented
- [ ] Performance impact considered
- [ ] Cross-browser compatibility tested

## Related Documentation

- [Project Overview PDR](./project-overview-pdr.md)
- [System Architecture](./system-architecture.md)
- [Code Standards](./code-standards.md)
- [Deployment Guide](./deployment-guide.md)
- [UI/UX Pro Max Skill (Style Intelligence)](../.claude/skills/software/design/ui-ux-pro-max/SKILL.md)
