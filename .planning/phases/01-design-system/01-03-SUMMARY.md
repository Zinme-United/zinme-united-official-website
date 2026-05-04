---
phase: 01-design-system
plan: 03
subsystem: ui
tags: [tailwindcss, design-tokens, hex-migration, semantic-classes]

# Dependency graph
requires:
  - phase: 01-design-system
    provides: "@theme token block with color, font, container, radius, shadow tokens"
provides:
  - "All 15 page and layout files migrated from hardcoded hex to semantic token classes"
  - "Zero hardcoded hex theme colors in active code across client/src/"
affects: [02-layout-shell, 03-home-page, 04-inner-pages]

# Tech tracking
tech-stack:
  added: []
  patterns: [semantic Tailwind token classes, var() for inline style colors, token comments for chart/SVG hex]

key-files:
  created: []
  modified:
    - client/src/pages/our-club/ClubPage.tsx
    - client/src/pages/activity-management/ActivityManagementPage.tsx
    - client/src/pages/player-management/PlayerManagementPage.tsx
    - client/src/pages/news-management/NewsManagementPage.tsx
    - client/src/pages/gallery-management/GalleryManagementPage.tsx
    - client/src/pages/club-management/ClubManagementPage.tsx
    - client/src/pages/articles/ArticlesPage.tsx
    - client/src/pages/articles-details/ArticlesDetails.tsx
    - client/src/layouts/AdminLayout.tsx
    - client/src/pages/players/Players.tsx
    - client/src/pages/player-details/PlayerDetails.tsx
    - client/src/pages/home/Home.tsx
    - client/src/pages/dashboard/AdminDashboard.tsx
    - client/src/pages/activities/Activities.tsx
    - client/src/pages/unauthorized/UnauthorizedPage.tsx

key-decisions:
  - "Used var(--color-primary-light) for Pitch chart bg instead of hardcoded #0D5BD7, with token comments"
  - "Mapped #0a2950 (prose headings) to primary-dark token as closest semantic match"
  - "Mapped #0b4e8a (featured article bg) to bg-primary-dark as closest semantic match"
  - "Replaced color='#003b75' icon props with className='text-primary' for consistency"

patterns-established:
  - "Icon color props use className instead of color prop for Tailwind token compatibility"
  - "Chart/SVG colors that must be JS strings use var(--color-*) with token comments"
  - "Non-club colors (green dots for pitch markers) are left as-is with documenting comments"

requirements-completed: [DSGN-01]

# Metrics
duration: 5min
completed: 2026-05-01
---

# Phase 1 Plan 3: Pages and Layouts Hex-to-Token Migration Summary

**All 15 page/layout files migrated from hardcoded hex colors to semantic Tailwind token classes, including gradient stops and chart/SVG inline styles**

## Performance

- **Duration:** 5 min
- **Started:** 2026-04-30T19:18:44Z
- **Completed:** 2026-04-30T19:23:50Z
- **Tasks:** 2
- **Files modified:** 15

## Accomplishments
- Replaced all hardcoded #003b75, #0056b3, #ffd700, #f8f9fa, #0b4e8a, #001e3a, #0a7abf, #0D5BD7, #0a2950 hex values across 15 files with semantic token classes
- Players.tsx gradient migrated from raw hex stops to from-primary-dark/via-primary/to-primary-light
- PlayerDetails.tsx Pitch chart config uses var(--color-primary-light) with token comments; non-club colors documented
- Full codebase audit confirms zero active hardcoded hex theme colors in any .tsx/.ts file
- Build passes without errors after migration

## Task Commits

Each task was committed atomically:

1. **Task 1: Migrate management pages and admin layout** - `f223613` (feat)
2. **Task 2: Migrate public pages and special cases** - `46ef9fc` (feat)

## Files Created/Modified
- `client/src/pages/our-club/ClubPage.tsx` - Replaced 15+ hex occurrences with primary/border-primary/ring-primary tokens
- `client/src/pages/activity-management/ActivityManagementPage.tsx` - Replaced text/bg/icon color hex values
- `client/src/pages/player-management/PlayerManagementPage.tsx` - Replaced text/bg/icon color hex values
- `client/src/pages/news-management/NewsManagementPage.tsx` - Replaced text/bg/icon color hex values
- `client/src/pages/gallery-management/GalleryManagementPage.tsx` - Replaced text/bg/icon color hex values
- `client/src/pages/club-management/ClubManagementPage.tsx` - Replaced text/bg hex values
- `client/src/pages/articles/ArticlesPage.tsx` - Replaced hex values including #0b4e8a featured bg
- `client/src/pages/articles-details/ArticlesDetails.tsx` - Replaced hex values including #0a2950 prose headings
- `client/src/layouts/AdminLayout.tsx` - Replaced sidebar bg-[#003b75] with bg-primary
- `client/src/pages/players/Players.tsx` - Gradient hex stops replaced with token classes
- `client/src/pages/player-details/PlayerDetails.tsx` - Chart bg uses var(), non-club colors documented
- `client/src/pages/home/Home.tsx` - bg-[#f8f9fa] replaced with bg-surface-alt
- `client/src/pages/dashboard/AdminDashboard.tsx` - text-[#003b75] replaced with text-primary
- `client/src/pages/activities/Activities.tsx` - text-[#003b75] replaced with text-primary
- `client/src/pages/unauthorized/UnauthorizedPage.tsx` - bg-[#003b75] replaced with bg-primary

## Decisions Made
- Used `var(--color-primary-light)` for Pitch chart background in PlayerDetails instead of keeping hardcoded hex -- allows theme changes to propagate into chart
- Mapped `#0a2950` (very close to `#002a54` primary-dark) to `text-primary-dark` token for prose headings in ArticlesDetails
- Mapped `#0b4e8a` to `bg-primary-dark` for featured article background in ArticlesPage (closest semantic match)
- Replaced `color="#003b75"` icon props with `className="text-primary"` rather than inline styles for Tailwind consistency
- Non-club colors (green pitch dots, white lines) left as-is with documenting comments since they aren't theme colors

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed duplicate className on Tag icon in ArticlesPage.tsx**
- **Found during:** Task 2 (build verification)
- **Issue:** Replacing `color="#003b75"` with `className="text-primary"` created a duplicate className attribute on the Tag icon which already had `className="h-4 w-4 mr-1"`
- **Fix:** Merged into single className: `className="h-4 w-4 mr-1 text-primary"`
- **Files modified:** client/src/pages/articles/ArticlesPage.tsx
- **Verification:** TypeScript build passes, no duplicate attribute errors
- **Committed in:** 46ef9fc (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Minor fix for attribute duplication caused by mechanical find-replace. No scope creep.

## Issues Encountered
None beyond the auto-fixed deviation above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- DSGN-01 requirement (semantic design tokens) is fully satisfied across all files
- Combined with Plan 01 (token foundation) and Plan 02 (components), the entire codebase uses semantic token classes
- Any future color changes only need to update the @theme block in index.css
- Phase 01 (Design System) is complete -- ready for Phase 02 (Layout Shell)

## Self-Check: PASSED

All 15 modified files exist. Both task commits verified (f223613, 46ef9fc).

---
*Phase: 01-design-system*
*Completed: 2026-05-01*
