# Phase 1: Design System - Context

**Gathered:** 2026-05-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Establish unified colors, typography, spacing tokens in Tailwind v4 CSS config, and consolidate duplicate libraries. Every component built after this phase uses consistent, club-branded visual tokens instead of scattered hardcoded values. This is foundation work only — no component building, no layout, no pages.

</domain>

<decisions>
## Implementation Decisions

### Club color palette
- Three-color system: navy blue primary, gold accent, white backgrounds
- Primary blue: navy (#003b75) — deep, authoritative, classic football club feel
- Accent gold: #ffd700 — used sparingly for highlights, active states, badges, small details only
- Light mode site: white/light gray backgrounds with dark text
- Gold should NOT be used for buttons, headers, or large surfaces — accents only to keep it classy

### Typography
- Heading font: Oswald (Google Fonts) — tall, condensed, bold, sporty
- Body font: Inter (Google Fonts) — clean, highly readable, screen-optimized
- H1 and H2 headings render in ALL CAPS for sporty, impactful feel
- H3 and below use normal case for readability
- No system fonts — both custom web fonts must be loaded

### Spacing & layout tokens
- Main content container: 1280px max-width
- Section vertical spacing: generous (80-100px) — premium breathing room between sections
- Card/component corner radius: 12-16px — noticeably rounded, softer and approachable
- Card elevation: subtle drop shadows for depth and visual hierarchy
- Consistent spacing scale defined as Tailwind tokens

### Library consolidation
- Date library: keep date-fns, remove dayjs — tree-shakeable, better for Vite bundle
- Icon library: keep lucide-react, remove react-icons — consistent stroke style, smaller bundle
- Loading libraries: keep both react-spinners and lottie-react — they serve different purposes
- All dayjs imports must be migrated to date-fns equivalents
- All react-icons imports must be migrated to lucide-react equivalents

### Claude's Discretion
- Exact Tailwind token naming conventions
- Type scale (font sizes for h1-h6, body, small)
- Exact shadow values for card elevation
- Semantic color token structure (how many shades per color)
- Spacing scale increments
- How to handle the existing hardcoded swiper overrides in index.css

</decisions>

<specifics>
## Specific Ideas

- Navy blue (#003b75) is already used in the codebase — maintain continuity
- Gold (#ffd700) already used for swiper pagination active state — this becomes the accent token
- Tailwind v4 uses CSS-based config (@theme in CSS), not tailwind.config.js — tokens go in index.css or a dedicated theme file
- Oswald + Inter is a proven pairing: Oswald brings athletic energy, Inter balances with clean readability

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-design-system*
*Context gathered: 2026-05-01*
