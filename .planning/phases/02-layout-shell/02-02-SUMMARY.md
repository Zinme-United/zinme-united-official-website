---
phase: 02-layout-shell
plan: 02
subsystem: ui
tags: [react, tailwind, footer, page-hero, layout, breadcrumbs]

# Dependency graph
requires:
  - phase: 02-layout-shell/01
    provides: "Navbar component, navLinks constant, design tokens"
provides:
  - "3-column Footer with nav links, contact info, social icons, dynamic copyright year"
  - "PageHero component with title, breadcrumbs, gradient overlay, parallax background"
  - "Full-width PublicLayout (no container constraint)"
  - "All inner pages wired with PageHero and breadcrumb navigation"
affects: [03-home-page, 04-inner-pages]

# Tech tracking
tech-stack:
  added: []
  patterns: [page-hero-breadcrumbs, full-width-layout-delegation]

key-files:
  created:
    - client/src/components/PageHero.tsx
  modified:
    - client/src/components/Footer.tsx
    - client/src/App.tsx
    - client/src/pages/our-club/ClubPage.tsx
    - client/src/pages/activities/Activities.tsx
    - client/src/pages/players/Players.tsx
    - client/src/pages/articles/ArticlesPage.tsx
    - client/src/pages/player-details/PlayerDetails.tsx
    - client/src/pages/articles-details/ArticlesDetails.tsx

key-decisions:
  - "Kept existing page-specific hero/filter sections below PageHero (e.g. Players search, Articles controls) rather than removing them"
  - "Replaced ClubPage custom hero with PageHero for visual consistency across inner pages"

patterns-established:
  - "PageHero pattern: every inner page starts with <PageHero title breadcrumbs /> for consistent branding"
  - "Layout delegation: PublicLayout is full-width, individual pages control their own max-width constraints"

requirements-completed: [NAVL-03, NAVL-04, NAVL-06]

# Metrics
duration: 3min
completed: 2026-05-04
---

# Phase 02 Plan 02: Footer, PageHero & Layout Shell Summary

**3-column footer with nav links and social icons, reusable PageHero with breadcrumbs on all inner pages, full-width PublicLayout**

## Performance

- **Duration:** 3 min
- **Started:** 2026-05-04T06:31:07Z
- **Completed:** 2026-05-04T06:34:00Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments
- Rebuilt Footer as 3-column responsive grid (Quick Links, Contact, Follow Us) with centered club crest and dynamic copyright year
- Created PageHero component with 40vh height, gradient overlay, title, breadcrumbs, and optional parallax background
- Updated PublicLayout to remove container constraint, enabling full-width page sections
- Wired PageHero into all 6 inner pages with appropriate breadcrumb navigation

## Task Commits

Each task was committed atomically:

1. **Task 1: Rebuild Footer and create PageHero** - `3bd83dd` (feat)
2. **Task 2: Update PublicLayout and wire PageHero** - `332a207` (feat)

## Files Created/Modified
- `client/src/components/PageHero.tsx` - Reusable inner-page hero with title, breadcrumbs, gradient overlay
- `client/src/components/Footer.tsx` - 3-column footer with nav links, contact info, social icons
- `client/src/App.tsx` - PublicLayout updated to full-width with semantic main element
- `client/src/pages/our-club/ClubPage.tsx` - Added PageHero with About title and breadcrumbs
- `client/src/pages/activities/Activities.tsx` - Added PageHero with Fixtures title and breadcrumbs
- `client/src/pages/players/Players.tsx` - Added PageHero with Squad title and breadcrumbs
- `client/src/pages/articles/ArticlesPage.tsx` - Added PageHero with News title and breadcrumbs
- `client/src/pages/player-details/PlayerDetails.tsx` - Added PageHero with dynamic player name
- `client/src/pages/articles-details/ArticlesDetails.tsx` - Added PageHero with dynamic article title

## Decisions Made
- Kept existing page-specific functional sections (Players search/filter hero, Articles sticky controls) below PageHero rather than removing them -- they contain interactive UI that users need
- Replaced ClubPage's custom hero image section with PageHero for visual consistency across all inner pages
- Home page left unchanged as it uses its own HeroSection with Swiper carousel

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Complete layout shell (Navbar + Footer + PageHero) is ready for home page and inner page redesign
- All public routes render with consistent header/footer bookends
- PageHero pattern established for all inner pages to follow

## Self-Check: PASSED

All created files exist. All commit hashes verified in git log.

---
*Phase: 02-layout-shell*
*Completed: 2026-05-04*
