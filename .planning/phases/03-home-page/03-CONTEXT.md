# Phase 3: Home Page - Context

**Gathered:** 2026-05-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver the complete home page with hero section, fixtures/results, news preview, squad spotlight, and sponsors. This is the club's showpiece — visitors land and immediately feel they are on a real football club's website. All sections use existing data. Hero section, scroll animations, and section composition are at Claude's discretion.

</domain>

<decisions>
## Implementation Decisions

### Fixtures & results display
- Single hero fixture card for the next match: opponent logo, date, venue, live countdown timer
- 3 recent results displayed as horizontal score cards showing team logos, score, and date
- Fixtures and results live in one combined "Matches" section — next fixture on top, results below
- "View all fixtures" link to the fixtures page

### News preview
- Featured layout: 1 large featured article card with image + 2 smaller cards below
- Each news card shows: thumbnail image, article title, 1-2 line excerpt, and publish date
- Clicking a news card navigates to the detail page (/news/:id)
- "View all news" link to the news listing page

### Squad spotlight
- 4 player cards — one per position group (GK, DEF, MID, FWD)
- Selection: first player listed in each position group from the data (deterministic)
- Each card shows: player photo, name, jersey number badge, and position label
- Clicking a player card navigates to their detail page (/squad/:id)
- "View full squad" link to the squad page

### Section linking
- Every section has a "View all" link to its respective inner page
- Individual cards link directly to detail pages (even if Phase 4 hasn't fully built them yet — routes exist)

### Claude's Discretion
- Hero section design (full-screen vs partial, image choice, CTA buttons, overlay content)
- Section order and spacing rhythm on the page
- Scroll animation intensity and Framer Motion transitions
- Sponsors section layout
- Responsive breakpoint behavior
- Loading and empty states

</decisions>

<specifics>
## Specific Ideas

- Next match card should feel prominent with a live countdown timer (days, hours, minutes, seconds)
- Result score cards should clearly show win/loss/draw at a glance
- News featured card should be visually larger to create hierarchy
- Player cards should feel like collectible trading cards — photo prominent, jersey number as a badge

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-home-page*
*Context gathered: 2026-05-04*
