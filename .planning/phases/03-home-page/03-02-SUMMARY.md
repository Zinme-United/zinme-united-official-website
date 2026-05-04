---
phase: 03-home-page
plan: 02
subsystem: ui
tags: [react, tailwind, animation, motion, news, squad, sponsors]

# Dependency graph
requires:
  - phase: 03-home-page plan 01
    provides: AnimatedSection wrapper, HeroSection, MatchesSection
  - phase: 01-design-system
    provides: Design tokens, color variables, Tailwind config
provides:
  - Refactored LatestNewsAndUpdates with 1-large + 2-small featured layout (no pagination)
  - SquadSpotlight selecting 1 player per position group (4 cards)
  - PartnersBanner with grayscale-to-color hover polish
  - Complete Home.tsx assembling all 5 sections with scroll animations
affects: [04-inner-pages]

# Tech tracking
tech-stack:
  added: []
  patterns: [position-group player selection, featured-card layout pattern, grayscale sponsor hover]

key-files:
  created: []
  modified:
    - client/src/components/LatestNewsAndUpdates.tsx
    - client/src/components/SquadSpotlight.tsx
    - client/src/components/PartnersBanner.tsx
    - client/src/pages/home/Home.tsx

key-decisions:
  - "SquadSpotlight uses startsWith matching on first 3 chars to handle both full names (Goalkeeper) and abbreviations (GK)"
  - "Removed GalleryPreview from home page entirely per plan requirements"

patterns-established:
  - "Featured news layout: 1 large card + 2 horizontal small cards below"
  - "Position group selection: map over canonical position names and find first match per group"
  - "Sponsor logo polish: grayscale filter with hover:grayscale-0 for professional feel"

requirements-completed: [HOME-04, HOME-05, HOME-06, HOME-07]

# Metrics
duration: 2min
completed: 2026-05-04
---

# Phase 03 Plan 02: News, Squad Spotlight & Partners Sections Summary

**Featured news layout (1-large + 2-small), position-based squad spotlight (4 cards), grayscale sponsor hover, and complete Home.tsx assembly with scroll animations**

## Performance

- **Duration:** 2 min
- **Started:** 2026-05-04T14:44:32Z
- **Completed:** 2026-05-04T14:46:10Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Refactored LatestNewsAndUpdates to show 1 large featured card with 2 smaller horizontal cards below, removing all pagination logic
- SquadSpotlight now selects exactly 4 players (one per position group: GK, DEF, MID, FWD) with flexible matching
- PartnersBanner logos use grayscale filter with color reveal on hover for professional polish
- Home.tsx fully assembled with 5 sections (Hero, Matches, News, Squad, Partners) all wrapped in AnimatedSection for scroll-triggered fade-up animations, GalleryPreview removed

## Task Commits

Each task was committed atomically:

1. **Task 1: Refactor LatestNewsAndUpdates, SquadSpotlight, and PartnersBanner** - `6af3a54` (feat)
2. **Task 2: Rewrite Home.tsx to assemble all sections with scroll animations** - `44ffd48` (feat)

## Files Created/Modified
- `client/src/components/LatestNewsAndUpdates.tsx` - 1-large + 2-small featured news layout, no pagination
- `client/src/components/SquadSpotlight.tsx` - 4 player cards, 1 per position group
- `client/src/components/PartnersBanner.tsx` - Grayscale-to-color hover on sponsor logos
- `client/src/pages/home/Home.tsx` - Assembled home page with all sections in AnimatedSection wrappers

## Decisions Made
- SquadSpotlight uses `startsWith` matching on first 3 characters of position name to handle both full names ("Goalkeeper") and abbreviations ("GK")
- Removed GalleryPreview section from Home.tsx entirely per plan requirements

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Home page complete with all 5 sections: Hero, Matches, News, Squad Spotlight, Partners
- All sections animate on scroll via AnimatedSection
- Ready for Phase 04 inner pages work

## Self-Check: PASSED

All files exist, all commits verified, TypeScript compiles cleanly.

---
*Phase: 03-home-page*
*Completed: 2026-05-04*
