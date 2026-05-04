# Phase 1: Design System - Research

**Researched:** 2026-05-01
**Domain:** Tailwind CSS v4 design tokens, typography, color systems, library consolidation
**Confidence:** HIGH

## Summary

Phase 1 establishes the visual foundation for the Zinme United website by defining semantic color tokens, loading custom web fonts, creating spacing/layout tokens, and removing duplicate libraries. The codebase currently has **305 hardcoded hex color references** across **38 files**, uses system fonts only, and has two unused libraries (dayjs, react-icons) that can be cleanly removed.

Tailwind CSS v4 uses a CSS-first `@theme` directive (not the old `tailwind.config.js`) to define design tokens. All tokens go in the CSS file (currently `index.css`) using CSS custom property namespaces like `--color-*`, `--font-*`, `--radius-*`, `--shadow-*`. This is already set up correctly -- the project uses `@tailwindcss/vite` plugin and `@import "tailwindcss"` in `index.css`.

**Primary recommendation:** Define all design tokens in a `@theme` block in `index.css`, load Oswald + Inter via Google Fonts `<link>` tags in `index.html`, then systematically replace all hardcoded hex values with semantic token classes across all 38 affected files.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Three-color system: navy blue primary (#003b75), gold accent (#ffd700), white backgrounds
- Gold should NOT be used for buttons, headers, or large surfaces -- accents only
- Light mode site: white/light gray backgrounds with dark text
- Heading font: Oswald (Google Fonts) -- bold, sporty
- Body font: Inter (Google Fonts) -- clean, readable
- H1 and H2 headings render in ALL CAPS
- H3 and below use normal case
- No system fonts -- both custom web fonts must be loaded
- Main content container: 1280px max-width
- Section vertical spacing: generous (80-100px)
- Card/component corner radius: 12-16px
- Card elevation: subtle drop shadows
- Date library: keep date-fns, remove dayjs
- Icon library: keep lucide-react, remove react-icons
- Loading libraries: keep both react-spinners and lottie-react

### Claude's Discretion
- Exact Tailwind token naming conventions
- Type scale (font sizes for h1-h6, body, small)
- Exact shadow values for card elevation
- Semantic color token structure (how many shades per color)
- Spacing scale increments
- How to handle the existing hardcoded swiper overrides in index.css

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DSGN-01 | Site uses unified color palette with club colors defined in Tailwind config (no hardcoded hex values) | @theme `--color-*` tokens; 305 hex occurrences across 38 files identified for replacement |
| DSGN-02 | Site uses custom typography with bold heading font and clean body font | Google Fonts Oswald + Inter via `<link>` tags; `--font-heading` and `--font-body` tokens |
| DSGN-03 | All pages use consistent spacing, container widths, and section padding via shared tokens | @theme `--spacing`, `--radius-*`, `--shadow-*`, `--container-*` tokens |
| DSGN-04 | Duplicate libraries consolidated (single date library, single icon library) | dayjs has 0 imports (clean uninstall); react-icons has 1 commented-out import (clean uninstall) |
</phase_requirements>

## Standard Stack

### Core (Already in Project)
| Library | Version | Purpose | Status |
|---------|---------|---------|--------|
| tailwindcss | ^4.1.5 | CSS framework with @theme tokens | Already installed, using CSS-first config |
| @tailwindcss/vite | ^4.1.5 | Vite plugin for Tailwind v4 | Already installed and configured |
| date-fns | ^4.1.0 | Date formatting (tree-shakeable) | Keep -- used in 4 files |
| lucide-react | ^0.508.0 | Icon library (consistent stroke style) | Keep -- used in 32 files |

### To Remove
| Library | Version | Reason | Risk |
|---------|---------|--------|------|
| dayjs | ^1.11.13 | Zero imports in codebase | None -- no code uses it |
| react-icons | ^5.5.0 | Only 1 commented-out import | None -- no active code uses it |

### To Add (External Resources, Not npm)
| Resource | Purpose | Method |
|----------|---------|--------|
| Google Fonts: Oswald | Heading font (weights 400, 700) | `<link>` tag in index.html |
| Google Fonts: Inter | Body font (weights 400, 500, 600, 700) | `<link>` tag in index.html |

## Architecture Patterns

### Tailwind v4 @theme Token Structure

All tokens defined in `client/src/index.css` using the `@theme` directive. This is the Tailwind v4 way -- no `tailwind.config.js` needed.

```css
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Oswald:wght@400;700&display=swap");
@import "tailwindcss";

@theme {
  /* --- Colors --- */
  --color-primary: #003b75;
  --color-primary-light: #0056b3;
  --color-primary-dark: #002a54;
  --color-accent: #ffd700;
  --color-accent-muted: #ffd700cc;
  --color-surface: #ffffff;
  --color-surface-alt: #f8f9fa;
  --color-text: #1a1a2e;
  --color-text-muted: #6b7280;
  --color-text-on-primary: #ffffff;
  --color-text-on-accent: #1a1a2e;

  /* --- Typography --- */
  --font-heading: "Oswald", sans-serif;
  --font-body: "Inter", sans-serif;

  /* --- Type Scale --- */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
  --text-5xl: 3rem;

  /* --- Spacing (base unit) --- */
  --spacing: 0.25rem;

  /* --- Container --- */
  --container-content: 80rem; /* 1280px */

  /* --- Border Radius --- */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-card: 0.875rem; /* 14px -- midpoint of 12-16px */

  /* --- Shadows --- */
  --shadow-card: 0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.08);
  --shadow-card-hover: 0 4px 12px 0 rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.08);
  --shadow-elevated: 0 10px 25px -5px rgb(0 0 0 / 0.1), 0 4px 10px -6px rgb(0 0 0 / 0.08);
}
```

### Recommended Token Naming

| Token | Tailwind Class | Replaces |
|-------|---------------|----------|
| `--color-primary` | `bg-primary`, `text-primary` | `bg-[#003b75]`, `text-[#003b75]` |
| `--color-primary-light` | `text-primary-light` | `text-[#0056b3]`, `hover:text-[#0056b3]` |
| `--color-primary-dark` | `bg-primary-dark` | `hover:bg-blue-900` (semantic replacement) |
| `--color-accent` | `text-accent`, `bg-accent` | `text-[#FFD700]`, `bg-[#ffd700]` |
| `--color-surface` | `bg-surface` | `bg-white`, `bg-[#ffffff]` |
| `--color-surface-alt` | `bg-surface-alt` | `bg-[#f8f9fa]` |
| `--font-heading` | `font-heading` | No current font class |
| `--font-body` | `font-body` | System font stack in `:root` |

### Font Loading Pattern

Use `<link>` tags in `index.html` (faster than CSS `@import` for fonts):

```html
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Oswald:wght@400;700&display=swap" rel="stylesheet">
</head>
```

Then in CSS, the `@import url(...)` line is NOT needed -- the fonts are loaded by the HTML. The `@theme` block just references them:
```css
@theme {
  --font-heading: "Oswald", sans-serif;
  --font-body: "Inter", sans-serif;
}
```

### Global Base Styles Pattern

Replace the current `:root` block with Tailwind token references:

```css
:root {
  font-family: var(--font-body);
  color: var(--color-text);
  background-color: var(--color-surface);
}
```

### H1/H2 Uppercase Pattern

Apply via global CSS (not per-component):
```css
h1, h2 {
  font-family: var(--font-heading);
  text-transform: uppercase;
}
h3, h4, h5, h6 {
  font-family: var(--font-heading);
}
```

### Anti-Patterns to Avoid
- **Mixing hardcoded hex with tokens:** Every component MUST use token classes. Zero tolerance for `[#003b75]` syntax after migration.
- **Using CSS `@import` for Google Fonts:** Slower than `<link>` tags; causes render-blocking chain. Use `<link>` in HTML `<head>`.
- **Resetting all defaults with `--*: initial`:** Do NOT nuke all Tailwind defaults. Only extend/override specific tokens. The default spacing, breakpoints, etc. should remain.
- **Over-shading the palette:** Three-color system does not need 10 shades each. Keep it minimal: primary (3 shades), accent (1-2), surface (2), text (2-3).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Color tokens | CSS variables scattered in components | Tailwind `@theme --color-*` | Single source of truth, generates utility classes |
| Font loading | Manual `@font-face` declarations | Google Fonts CDN `<link>` tags | CDN caching, automatic format negotiation, `font-display: swap` |
| Spacing system | Custom spacing values per component | Tailwind's built-in `--spacing` base unit | Multiplier-based scale (p-4 = 1rem, p-8 = 2rem) is already perfect |
| Container width | Manual `max-width: 1280px` | `--container-content` token with `max-w-content` class | Reusable, discoverable, consistent |

## Common Pitfalls

### Pitfall 1: CSS @import Order with Tailwind v4
**What goes wrong:** Putting `@import url("fonts...")` AFTER `@import "tailwindcss"` causes browser rejection.
**Why it happens:** CSS spec requires all `@import` statements before any other rules.
**How to avoid:** If using CSS-based font imports, place them BEFORE `@import "tailwindcss"`. Better yet, use `<link>` tags in HTML instead.
**Warning signs:** Fonts not loading, browser console showing CSS parse errors.

### Pitfall 2: Forgetting Inline Style Hex Values
**What goes wrong:** Find-and-replace catches className hex values but misses `style={{ color: "#003b75" }}` in JSX.
**Why it happens:** Some components (like `Pitch.tsx` and `PlayerDetails.tsx`) pass colors as JS objects to SVG or chart configs.
**How to avoid:** Search for hex values in BOTH className strings AND style/props objects. Use `var(--color-primary)` in inline styles or pass CSS variable references.
**Warning signs:** Grep still finds hex values after "complete" migration.

### Pitfall 3: Swiper Override Specificity
**What goes wrong:** Swiper custom styles use `!important` and hardcoded hex values. Replacing with tokens may break specificity.
**Why it happens:** Swiper injects its own styles that need `!important` overrides.
**How to avoid:** Keep `!important` on swiper overrides but replace hex values with `var(--color-*)` CSS variables. Swiper overrides use plain CSS, not Tailwind classes, so use `var()` directly.
**Warning signs:** Swiper navigation/pagination loses styling after token migration.

### Pitfall 4: Lucide-React Color Props
**What goes wrong:** Some lucide-react icons receive `color="#003b75"` as a prop. Tailwind classes don't apply here.
**Why it happens:** Icon components accept color as a string prop, not a CSS class.
**How to avoid:** Remove the `color` prop and use `className="text-primary"` instead -- lucide-react icons inherit text color via `currentColor`.
**Warning signs:** Icons showing wrong colors or defaulting to black.

### Pitfall 5: Missing Font Weights
**What goes wrong:** Oswald renders in default weight, not bold, because only `wght@400` was loaded.
**Why it happens:** Google Fonts requires explicit weight specification in the URL.
**How to avoid:** Load `Oswald:wght@400;700` and `Inter:wght@400;500;600;700` to cover all used weights.
**Warning signs:** Headings look thinner than expected.

## Code Examples

### Complete index.css After Migration
```css
/* Source: Tailwind v4 official docs - https://tailwindcss.com/docs/theme */
@import "tailwindcss";

@theme {
  --color-primary: #003b75;
  --color-primary-light: #0056b3;
  --color-primary-dark: #002a54;
  --color-accent: #ffd700;
  --color-surface: #ffffff;
  --color-surface-alt: #f8f9fa;
  --color-text: #1a1a2e;
  --color-text-muted: #6b7280;

  --font-heading: "Oswald", sans-serif;
  --font-body: "Inter", sans-serif;

  --container-content: 80rem;

  --radius-card: 0.875rem;

  --shadow-card: 0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.08);
  --shadow-card-hover: 0 4px 12px 0 rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.08);
  --shadow-elevated: 0 10px 25px -5px rgb(0 0 0 / 0.1), 0 4px 10px -6px rgb(0 0 0 / 0.08);
}

/* Global base styles */
:root {
  font-family: var(--font-body);
  line-height: 1.5;
  font-weight: 400;
  color: var(--color-text);
  background-color: var(--color-surface);
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Heading typography */
h1, h2 {
  font-family: var(--font-heading);
  text-transform: uppercase;
  letter-spacing: 0.02em;
}
h3, h4, h5, h6 {
  font-family: var(--font-heading);
}

/* Link defaults */
a {
  font-weight: 500;
  color: var(--color-primary);
  text-decoration: inherit;
}
a:hover {
  color: var(--color-primary-light);
}

body {
  margin: 0;
  min-height: 100vh;
}

/* Swiper custom overrides -- keep !important, use token variables */
.swiper-button-next,
.swiper-button-prev {
  color: white !important;
  background: rgba(0, 59, 117, 0.6); /* primary with alpha -- ok to keep raw for rgba */
  width: 44px !important;
  height: 44px !important;
  border-radius: 50%;
  backdrop-filter: blur(4px);
}
.swiper-button-next::after,
.swiper-button-prev::after {
  font-size: 18px !important;
  font-weight: bold;
}
.swiper-pagination-bullet {
  background: white !important;
  opacity: 0.5 !important;
}
.swiper-pagination-bullet-active {
  opacity: 1 !important;
  background: var(--color-accent) !important;
}
```

### Hex-to-Token Replacement Map
```
bg-[#003b75]       -> bg-primary
text-[#003b75]     -> text-primary
hover:bg-[#003b75] -> hover:bg-primary
text-[#0056b3]     -> text-primary-light
hover:text-[#0056b3] -> hover:text-primary-light
text-[#FFD700]     -> text-accent
bg-[#ffd700]       -> bg-accent
bg-[#f8f9fa]       -> bg-surface-alt
text-[#1a1a2e]     -> text-text (or just use default body color)
color="#003b75"     -> className="text-primary" (remove color prop)
```

### Library Removal Commands
```bash
cd client
npm uninstall dayjs react-icons
```

## Codebase Audit Results

### Hardcoded Hex Color Inventory
| Hex Value | Occurrences | Files | Token Mapping |
|-----------|-------------|-------|---------------|
| #003b75 | ~250 | 36 | `--color-primary` |
| #0056b3 | ~15 | 5 | `--color-primary-light` |
| #ffd700 / #FFD700 | ~15 | 4 | `--color-accent` |
| #f8f9fa | ~3 | 2 | `--color-surface-alt` |
| #1a1a2e | 1 | index.css | `--color-text` |
| #0D5BD7 | 3 | PlayerDetails.tsx | Needs mapping -- chart accent color |
| #0b4e8a | 1 | ArticlesPage.tsx | Needs mapping -- featured article bg |
| #001e3a / #0a7abf | 2 | Players.tsx | Gradient variants of primary |

### Library Import Audit
| Library | Active Imports | Commented Imports | Safe to Remove |
|---------|---------------|-------------------|----------------|
| dayjs | 0 | 0 | Yes -- zero references |
| react-icons | 0 | 1 (PlayerDetails.tsx) | Yes -- only a comment |
| date-fns | 4 files (format function) | 1 commented | Keep |
| lucide-react | 32 files | 0 | Keep |

### Files Requiring Font Class Addition
Every file with heading text needs `font-heading` added to heading elements, OR global CSS handles it via `h1-h6` selectors (recommended approach -- less churn).

## State of the Art

| Old Approach (Tailwind v3) | Current Approach (Tailwind v4) | Impact |
|---------------------------|-------------------------------|--------|
| `tailwind.config.js` theme object | `@theme` directive in CSS | Config is now CSS-native |
| `extend.colors` in JS | `--color-*` CSS variables | Tokens are standard CSS custom properties |
| `theme.fontFamily` in JS | `--font-*` CSS variables | Can use `var()` anywhere |
| `plugins` array in JS | CSS `@plugin` directive | Not needed for this phase |

## Open Questions

1. **Gradient variants (#001e3a, #0a7abf, #0b4e8a)**
   - What we know: Used in Players.tsx for a gradient background and ArticlesPage featured card
   - What's unclear: Whether these should be semantic tokens or kept as one-off gradient utilities
   - Recommendation: Add `--color-primary-darker: #001e3a` and `--color-primary-lighter: #0a7abf` as optional gradient tokens. Or use Tailwind's built-in `from-primary/to-primary-light` gradient utilities.

2. **Chart/SVG colors in Pitch.tsx and PlayerDetails.tsx**
   - What we know: Colors are passed as JS object properties (`bg: "#0D5BD7"`, `line: "#ffffff"`, `dotFill: "#69E36F"`)
   - What's unclear: Whether these can reference CSS variables or need to stay as strings
   - Recommendation: Use `getComputedStyle(document.documentElement).getPropertyValue('--color-primary')` or accept that SVG/chart configs may keep hardcoded values with a comment referencing the token they correspond to.

3. **Swiper rgba() values**
   - What we know: `.swiper-button-next` uses `rgba(0, 59, 117, 0.6)` which is primary at 60% opacity
   - Recommendation: Keep as-is with a comment linking to the token. CSS `color-mix()` or Tailwind's opacity modifiers (`bg-primary/60`) are alternatives but add complexity for swiper overrides.

## Sources

### Primary (HIGH confidence)
- [Tailwind CSS v4 Theme Variables](https://tailwindcss.com/docs/theme) - @theme directive syntax, variable namespaces, complete token system
- [Tailwind CSS v4 Font Family](https://tailwindcss.com/docs/font-family) - Custom font configuration, @import ordering, Google Fonts integration
- [Tailwind CSS v4 Colors](https://tailwindcss.com/docs/customizing-colors) - Custom color token patterns

### Secondary (MEDIUM confidence)
- [Google Fonts: Oswald](https://fonts.google.com/specimen/Oswald) - Available weights, specimen
- [CDN Planet: Google Font Preconnect](https://www.cdnplanet.com/blog/faster-google-webfonts-preconnect/) - Preconnect performance pattern

### Codebase Analysis (HIGH confidence)
- Direct grep of all `client/src/` files for hex colors, font-family, dayjs, react-icons imports

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Already installed, versions confirmed in package.json
- Architecture (@theme tokens): HIGH - Verified against official Tailwind v4 docs
- Color migration scope: HIGH - Complete grep audit of codebase
- Library consolidation: HIGH - Import audit shows zero active usage of removed libs
- Typography: HIGH - Google Fonts + @theme pattern verified in official docs
- Pitfalls: MEDIUM - Based on known CSS specificity and Tailwind v4 behavior patterns

**Research date:** 2026-05-01
**Valid until:** 2026-06-01 (stable domain, Tailwind v4 is mature)
