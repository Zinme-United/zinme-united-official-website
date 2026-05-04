# Phase 4: Inner Pages - Context

**Gathered:** 2026-05-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Build all 5 content pages — Squad, Fixtures & Results, News, Gallery, and About — each fully data-driven with existing API data. Every page uses the shared layout shell (navbar, footer, PageHero) from Phase 2. This phase completes the full-site experience.

</domain>

<decisions>
## Implementation Decisions

### Squad page
- Players grouped by position (Goalkeepers, Defenders, Midfielders, Forwards) with section headers
- Gender tabs (Men's / Women's) to switch between squads — keep existing tab functionality
- Player cards use the same style as the home page spotlight (photo, gradient overlay, jersey number badge, name, position)
- Clicking a player card navigates to the player detail page

### Player detail page
- Full profile layout: large player photo, bio text, stats (age, kit number, appearances)
- Pitch position map showing where the player plays (existing positionToMarkers utility)
- Keep existing player detail page structure, polish the visual design

### Fixtures & results page
- Two tabs: "Upcoming" (future matches) and "Results" (past matches with scores)
- Each match card shows: team logos, team names, date/time, venue (Home/Away)
- Result cards also show score with win/draw/loss color indicator
- Same visual language as home page score cards but expanded with more detail (venue, date)
- No league standings table on this page

### News listing page
- Card grid layout: 3 columns desktop, 2 tablet, 1 mobile
- Each card shows: thumbnail image, title, excerpt, and publish date
- Pagination: 9-12 articles per page with page numbers
- Clicking a card navigates to the article detail page

### Article detail page
- Large hero image at top, article title, publish date, then full HTML content with embedded images
- "More News" section at bottom with 2-3 related article cards
- Back-to-news navigation

### Gallery page
- Masonry grid layout (Pinterest-style) for photos of varying sizes
- Flat grid — all photos together, no album/event grouping
- Clicking a photo opens a lightbox viewer

### Lightbox viewer
- Fullscreen overlay with large image display
- Left/right arrow navigation to browse between photos
- Close button and photo caption/title if available
- Keyboard navigation support (arrows, escape)

### About page
- Minimal content: club history section and mission/values statement
- No coaching staff profiles — keep it simple

### Claude's Discretion
- Responsive breakpoint behavior for all pages
- Loading states and skeleton screens
- Empty state messaging
- Search/filter on squad page (beyond gender tabs)
- Animation and transition details
- Lightbox implementation approach (custom vs library)

</decisions>

<specifics>
## Specific Ideas

- Squad cards should be visually consistent with the home page spotlight — reuse the same component if possible
- Fixtures match cards should feel like an expanded version of the home page result cards
- Gallery masonry should feel dynamic and visual — the page is about showcasing photos
- Lightbox should support keyboard navigation for desktop users

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-inner-pages*
*Context gathered: 2026-05-04*
