# Phase 2: Layout Shell - Context

**Gathered:** 2026-05-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the shared layout components that wrap every page: navbar, mobile navigation, footer, and page hero. After this phase, every route has professional football club chrome with responsive behavior across mobile, tablet, and desktop.

</domain>

<decisions>
## Implementation Decisions

### Navbar behavior & style
- Sticky navbar with backdrop blur effect on scroll
- Starts transparent over the hero image, transitions to solid/blurred background on scroll
- Contains: club crest + club name text + nav links (Home, Squad, Fixtures, News, Gallery, About) — nothing else
- Active page link highlighted with gold (accent color) underline
- White text on transparent state, adjusts for readability on solid state

### Mobile navigation
- Full-screen overlay menu (not drawer or dropdown)
- Solid primary (dark blue) background with white/gold text
- Content: club crest prominently at top, large tap-friendly nav links in center, social media icons at bottom
- Hamburger icon placed on the right side of the navbar
- Smooth open/close animation

### Footer layout & content
- 3-column layout: navigation links | contact info (address, email) | social media icons
- Dark primary blue background with white text (visual bookend with navbar)
- Club crest displayed centered above the columns
- Copyright line with current year at the bottom
- No newsletter signup or email capture

### Page hero treatment
- Medium height (~40vh) on inner pages
- Dark gradient overlay (dark at bottom to transparent at top) for text readability
- Page title displayed prominently with breadcrumbs below (e.g., Home > Squad > Player)
- Background image uses fixed positioning for subtle parallax effect on scroll
- Title in Oswald uppercase (inherits from global heading styles)

### Claude's Discretion
- Exact animation timing and easing curves for navbar transition and mobile menu
- Responsive breakpoint behavior (when to switch from desktop nav to hamburger)
- Footer column stacking behavior on mobile
- Hero image fallback when no background image is provided

</decisions>

<specifics>
## Specific Ideas

- Navbar should feel like top-tier football club sites (Man City, Arsenal) — transparent hero overlap with blur on scroll
- Mobile menu should feel premium — full-screen takeover, not a cramped sidebar
- Footer acts as a visual bookend matching the navbar's dark blue branding

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-layout-shell*
*Context gathered: 2026-05-01*
