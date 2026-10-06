# Design Principles: Beautiful & Right

## BEAUTIFUL: Understanding Aesthetic Principles

### Study Process
Analyze high-quality designs on Dribbble, Mobbin, Behance. Ask AI to identify:
- Design styles (Memphis, Flat Design, Glassmorphism, Neo-brutalism, Minimalism)
- Layout structures & applications
- Typography systems (font pairing, hierarchy, scaling)
- Color systems (palettes, contrasts, psychology)

### Visual Hierarchy
Guide users through interfaces effectively:
- **Size**: Larger elements draw attention first
- **Contrast**: High contrast (text/background) boosts readability
- **Typography**: Use weight, size, style for hierarchy
- **Placement**: F-pattern (web), Z-pattern (landing pages)
- **Spacing**: White space improves clarity, reduces cognitive load

### Typography Best Practices
- Stick to 2-3 typefaces max
- Clear font hierarchy with proper spacing, sizes, alignment
- Appropriate font sizes for readability across devices
- Short, scannable paragraphs

### Color Theory Applications
- **Blue**: Trust, security, calmness
- **Red**: Urgency, passion, excitement
- **Warm colors**: Drive urgency
- **Cool colors**: Create trust
- Use color intentionally to direct attention & evoke emotion
- Ensure WCAG AA contrast ratios (4.5:1 text, 3:1 large text)

### White Space
Not empty—essential for clarity. Proper spacing between sections, buttons, text improves readability & gives visual breathing room.

## RIGHT: Ensuring Functionality

### Design Systems Research
Search "Figma Design System + [style]" to understand:
- Component architecture (atomic design: atoms → molecules → organisms)
- Layout principles (grid systems, responsive breakpoints)
- UX patterns & interactions

### Design Tokens & Scales
Decide once, export as tokens (CSS vars or JSON — `--color-primary`, `--font-headline-md`, `--space-4`), and consume tokens in components instead of raw values. That is what makes a theme switch (light/dark) automatic.
- **Semantic color roles**: Primary · Secondary · Tertiary · Success · Warning · Error, each with an "On" role for the text that sits on it. 5–9 shades per hue; ad-hoc colors outside the palette fragment consistency. Material Design 3 builds these in the HCT color space so light and dark palettes stay perceptually even.
- **Type scale**: a constrained ladder — Display → Headline → Title → Body → Label, each Small/Medium/Large (Material Design 3). Constraint gives hierarchy without choice overload.
- **Spacing scale**: one base unit and its multiples (4 · 8 · 12 · 16 · 24 · 32 · 48 · 64px) for margin, padding and gap.
- **Touch targets**: ≥ 44×44pt (Apple HIG) / 48×48dp (Material).
- Cross-check against [Material Design 3](https://m3.material.io/styles), [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/) and [Web Interface Guidelines](https://interfaces.rauno.me/); verify contrast with a checker, not by eye.

### Component Library Standards
- Semantic HTML first (button > div with ARIA roles)
- Built-in accessibility, focus handling, keyboard interaction
- Each component tested for accessibility before adding
- Documentation includes structure, focus order, keyboard expectations, screen reader announcements

### Accessibility Requirements
- WCAG 2.1 AA minimum (work toward 2.2)
- Color contrast ratios meet/exceed minimums
- Alt text for images
- Color-blind-friendly palettes
- Keyboard navigation support
- Screen reader compatibility

### Testing Protocol
- Automated tools catch 30-50% of issues
- Manual testing crucial for comprehensive coverage
- Test with real users when possible
