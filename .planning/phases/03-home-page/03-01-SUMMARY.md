---
phase: 03-home-page
plan: 01
subsystem: ui
tags: [motion, framer-motion, react, tailwind, countdown, animation]

# Dependency graph
requires:
  - phase: 02-layout-shell
    provides: Layout shell with Navbar and Footer wrapping all pages
  - phase: 01-design-system
    provides: Design tokens, color variables, Tailwind config
provides:
  - AnimatedSection reusable scroll-triggered animation wrapper
  - Redesigned static full-viewport HeroSection with club crest and CTA
  - MatchesSection with next-match countdown and recent results cards
affects: [03-home-page plan 02, inner pages that may use AnimatedSection]

# Tech tracking
tech-stack:
  added: [motion@12.38.0]
  patterns: [whileInView scroll animation, countdown timer hook, result color parsing]

key-files:
  created:
    - client/src/components/AnimatedSection.tsx
    - client/src/components/MatchesSection.tsx
  modified:
    - client/src/components/HeroSection.tsx
    - client/src/pages/home/Home.tsx
    - client/package.json
    - client/package-lock.json

key-decisions:
  - "Extracted countdown logic into useCountdown custom hook within MatchesSection for encapsulation"
  - "Installed motion in client/ directory (not root) since project uses client/server monorepo structure"
  - "Result border color parsing uses regex to detect score patterns like '3-1' for win/loss/draw indicators"

patterns-established:
  - "AnimatedSection pattern: wrap any section in AnimatedSection for consistent fade-up on scroll"
  - "Countdown hook pattern: useMemo for targetDateTime + useEffect/setInterval for tick recalculation"
  - "Section header pattern: accent subtitle + bold title + right-aligned view-all link"

requirements-completed: [HOME-01, HOME-02, HOME-03, HOME-07]

# Metrics
duration: 3min
completed: 2026-05-04
---

# Phase 03 Plan 01: Hero, AnimatedSection & MatchesSection Summary

**Full-viewport static hero with club crest overlay, reusable motion.section animation wrapper, and combined fixtures section with live countdown timer and recent result score cards**

## Performance

- **Duration:** 3 min
- **Started:** 2026-05-04T14:38:57Z
- **Completed:** 2026-05-04T14:42:15Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- Installed motion library and created AnimatedSection for reusable scroll-triggered fade-up animations
- Redesigned HeroSection as a static full-viewport hero with club crest, gradient overlay, headline, and CTA button (removed Swiper carousel and floating next-match banner)
- Built MatchesSection combining next-match countdown card with glassmorphism timer boxes and 3 recent result cards with win/loss/draw color indicators

## Task Commits

Each task was committed atomically:

1. **Task 1: Install motion and create AnimatedSection + redesign HeroSection** - `03e95bf` (feat)
2. **Task 2: Build MatchesSection with next-match countdown and recent results** - `dbf8c1b` (feat)

## Files Created/Modified
- `client/src/components/AnimatedSection.tsx` - Reusable motion.section wrapper with whileInView fade-up animation
- `client/src/components/HeroSection.tsx` - Static full-viewport hero with club crest, gradient overlay, and CTA
- `client/src/components/MatchesSection.tsx` - Combined next-match countdown card + recent results grid + view-all link
- `client/src/pages/home/Home.tsx` - Updated to use new prop-less HeroSection
- `client/package.json` - Added motion dependency
- `client/package-lock.json` - Lock file updated

## Decisions Made
- Extracted countdown logic into a `useCountdown` custom hook within MatchesSection for encapsulation rather than importing from NextMatch.tsx
- Installed motion in `client/` directory (not root) since project uses client/server monorepo structure
- Result border color parsing uses regex to detect score patterns like "3-1" for green/red/gray left-border indicators

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Installed motion in correct directory**
- **Found during:** Task 1
- **Issue:** Initially installed motion at root level, but the project tracks package.json in client/ and server/ directories separately
- **Fix:** Installed motion in client/ directory and removed the accidental root-level install
- **Files modified:** client/package.json, client/package-lock.json
- **Verification:** `npm ls motion` in client/ confirms 12.38.0 installed
- **Committed in:** 03e95bf (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Necessary correction for monorepo structure. No scope creep.

## Issues Encountered
None beyond the package install directory fix noted above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- AnimatedSection ready for use in plan 02 sections (news, squad, gallery, partners)
- MatchesSection ready to be integrated into Home.tsx in plan 02
- HeroSection complete and already integrated into Home.tsx

## Self-Check: PASSED

All files exist, all commits verified, TypeScript compiles cleanly.

---
*Phase: 03-home-page*
*Completed: 2026-05-04*
