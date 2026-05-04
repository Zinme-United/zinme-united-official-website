---
phase: 01-design-system
plan: 02
subsystem: ui
tags: [tailwindcss, design-tokens, semantic-classes, hex-migration, component-refactor]

# Dependency graph
requires:
  - phase: 01-design-system plan 01
    provides: "@theme token block with color, font, container, radius, shadow tokens"
provides:
  - "All 23 component files migrated to semantic Tailwind token classes"
  - "Zero hardcoded theme hex values in client/src/components/"
affects: [01-design-system, 02-layout-shell, 03-home-page]

# Tech tracking
tech-stack:
  added: []
  patterns: [semantic token classes (bg-primary, text-accent), lucide-react className over color prop, var(--color-*) for SVG/inline-style contexts]

key-files:
  created: []
  modified:
    - client/src/components/OurClubCreateModal.tsx
    - client/src/components/ActivityFormModal.tsx
    - client/src/components/PlayerProfileModal.tsx
    - client/src/components/NewsCreateModal.tsx
    - client/src/components/GalleryCreateModal.tsx
    - client/src/components/ActivityDetailsModal.tsx
    - client/src/components/EventCalendar.tsx
    - client/src/components/LatestNewsAndUpdates.tsx
    - client/src/components/HeroSection.tsx
    - client/src/components/GalleriesCard.tsx
    - client/src/components/SquadSpotlight.tsx
    - client/src/components/Navbar.tsx
    - client/src/components/Footer.tsx
    - client/src/components/NextMatch.tsx
    - client/src/components/LoginForm.tsx
    - client/src/components/GalleryPreview.tsx
    - client/src/components/RegisterForm.tsx
    - client/src/components/PlayerModal.tsx
    - client/src/components/PartnersBanner.tsx
    - client/src/components/FeaturedContentAndHighlights.tsx
    - client/src/components/PlayersCard.tsx
    - client/src/components/Pitch.tsx
    - client/src/components/ConfirmationModal.tsx

key-decisions:
  - "Used var(--color-primary) and var(--color-surface) in Pitch.tsx SVG theme defaults since CSS classes cannot be used in inline style/SVG attribute contexts"
  - "Converted lucide-react color='#hex' props to className='text-*' throughout, leveraging currentColor inheritance"
  - "Fixed broken focus:[#003b75] class in LoginForm.tsx to focus:ring-primary (Rule 1 bug fix)"

patterns-established:
  - "All component colors use semantic token classes: bg-primary, text-primary, text-accent, bg-surface-alt, etc."
  - "Lucide icons use className text-* classes instead of color prop with hex strings"
  - "SVG drawing configs that cannot use Tailwind classes use var(--color-*) CSS variables"
  - "Non-theme colors (chart green #66E26F, placeholder URLs) are left as-is with comments"

requirements-completed: [DSGN-01]

# Metrics
duration: 3min
completed: 2026-05-01
---

# Phase 1 Plan 2: Component Hex Migration Summary

**All 23 component files migrated from hardcoded hex colors to semantic Tailwind token classes (bg-primary, text-accent, etc.) with zero theme hex values remaining**

## Performance

- **Duration:** 3 min
- **Started:** 2026-04-30T19:18:40Z
- **Completed:** 2026-04-30T19:22:19Z
- **Tasks:** 2
- **Files modified:** 23

## Accomplishments
- Eliminated all hardcoded theme hex values (#003b75, #0056b3, #FFD700, #f8f9fa, #1a1a2e, #001529) across 23 component files
- Replaced ~190 hex occurrences with semantic token classes (bg-primary, text-primary, text-accent, bg-surface-alt, etc.)
- Converted all lucide-react icon color="#hex" props to className="text-*" pattern
- Handled Pitch.tsx SVG context with var(--color-*) CSS variables
- Fixed pre-existing broken CSS class focus:[#003b75] in LoginForm.tsx

## Task Commits

Each task was committed atomically:

1. **Task 1: Migrate high-count component files (10+ hex occurrences)** - `62de884` (feat)
2. **Task 2: Migrate remaining component files (1-9 hex occurrences)** - `c0feb7c` (feat)

## Files Created/Modified
- `client/src/components/OurClubCreateModal.tsx` - 38 hex replacements to token classes
- `client/src/components/ActivityFormModal.tsx` - 30 hex replacements to token classes
- `client/src/components/PlayerProfileModal.tsx` - 18 hex replacements + lucide color prop conversions
- `client/src/components/NewsCreateModal.tsx` - 22 hex replacements to token classes
- `client/src/components/GalleryCreateModal.tsx` - 16 hex replacements to token classes
- `client/src/components/ActivityDetailsModal.tsx` - 14 hex replacements to token classes
- `client/src/components/EventCalendar.tsx` - 12 hex replacements to token classes
- `client/src/components/LatestNewsAndUpdates.tsx` - 18 hex replacements to token classes
- `client/src/components/HeroSection.tsx` - 12 hex replacements including gradients
- `client/src/components/GalleriesCard.tsx` - 10 hex replacements to token classes
- `client/src/components/SquadSpotlight.tsx` - 10 hex replacements including gradients
- `client/src/components/Navbar.tsx` - 5 hex replacements to token classes
- `client/src/components/Footer.tsx` - 5 hex replacements + lucide color prop conversions
- `client/src/components/NextMatch.tsx` - 6 hex replacements including gradients
- `client/src/components/LoginForm.tsx` - 4 hex replacements + broken class fix
- `client/src/components/GalleryPreview.tsx` - 5 hex replacements to token classes
- `client/src/components/RegisterForm.tsx` - 2 hex replacements to token classes
- `client/src/components/PlayerModal.tsx` - 2 hex replacements to token classes
- `client/src/components/PartnersBanner.tsx` - 2 hex replacements to token classes
- `client/src/components/FeaturedContentAndHighlights.tsx` - 4 hex replacements to token classes
- `client/src/components/PlayersCard.tsx` - 1 hex replacement to token class
- `client/src/components/Pitch.tsx` - SVG theme defaults converted to var(--color-*) references
- `client/src/components/ConfirmationModal.tsx` - 1 hex replacement to token class

## Decisions Made
- Used `var(--color-primary)` and `var(--color-surface)` in Pitch.tsx SVG theme config defaults since CSS classes cannot be applied to inline style/SVG attribute contexts
- Converted all lucide-react `color="#hex"` props to `className="text-*"` throughout, taking advantage of lucide's currentColor default
- Fixed broken `focus:[#003b75]` class in LoginForm.tsx (missing property name) to `focus:ring-primary`
- Left chart-specific green (#66E26F) and placeholder URL hex values as-is since they are not theme colors

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed broken CSS class in LoginForm.tsx**
- **Found during:** Task 2 (LoginForm.tsx migration)
- **Issue:** `focus:[#003b75]` was missing a CSS property name (invalid Tailwind class)
- **Fix:** Replaced with `focus:ring-primary` which is the correct token class
- **Files modified:** client/src/components/LoginForm.tsx
- **Verification:** Class is now valid Tailwind syntax
- **Committed in:** c0feb7c (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Bug fix necessary for correctness. No scope creep.

## Deferred Issues

- **Pre-existing build error:** `src/pages/articles/ArticlesPage.tsx(201,47): error TS17001: JSX elements cannot have multiple attributes with the same name.` -- This error exists on the base branch before any changes. Not caused by this plan's work.

## Issues Encountered
None beyond the pre-existing build error noted above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All component files now use semantic token classes exclusively
- Token system is fully connected: @theme tokens in index.css -> Tailwind utility classes in components
- Plan 03 can proceed with any remaining design system work
- Changing the club's color palette now requires editing only index.css @theme block

---
*Phase: 01-design-system*
*Completed: 2026-05-01*
