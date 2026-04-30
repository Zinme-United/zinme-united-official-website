# Roadmap: Zinme United Website Redesign

## Overview

Transform the Zinme United website from its current state into a polished football club website that visitors cannot distinguish from a professional club's site. The work flows from establishing a consistent design foundation, through the site-wide layout shell, into the home page showpiece, and finally the inner pages that complete the full-site experience. All work is frontend-only using existing data.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Design System** - Establish unified colors, typography, spacing tokens, and consolidate duplicate libraries
- [ ] **Phase 2: Layout Shell** - Build navbar, footer, mobile nav, page hero, and responsive layout shared across all pages
- [ ] **Phase 3: Home Page** - Deliver the complete home page with hero, fixtures, results, news, squad spotlight, and sponsors
- [ ] **Phase 4: Inner Pages** - Build all content pages (Squad, Fixtures, News, Gallery, About) with full data integration

## Phase Details

### Phase 1: Design System
**Goal**: Every component built from this point forward uses consistent, club-branded visual tokens instead of scattered hardcoded values
**Depends on**: Nothing (first phase)
**Requirements**: DSGN-01, DSGN-02, DSGN-03, DSGN-04
**Success Criteria** (what must be TRUE):
  1. Club colors are defined as semantic Tailwind tokens and no hardcoded hex color values remain in component files
  2. Headings render in a bold custom web font and body text renders in a clean custom web font (no system fonts)
  3. Shared spacing, container width, and section padding tokens exist and are applied consistently
  4. Only one date library and one icon library remain in package.json
**Plans**: 3 plans

Plans:
- [ ] 01-01-PLAN.md — Define @theme tokens, load Oswald + Inter fonts, set global typography, remove dayjs and react-icons
- [ ] 01-02-PLAN.md — Migrate all 23 component files from hardcoded hex to semantic token classes
- [ ] 01-03-PLAN.md — Migrate all 15 page and layout files from hardcoded hex to semantic token classes

### Phase 2: Layout Shell
**Goal**: Visitors see professional football club navigation and layout on every page, with seamless mobile experience
**Depends on**: Phase 1
**Requirements**: NAVL-01, NAVL-02, NAVL-03, NAVL-04, NAVL-05, NAVL-06
**Success Criteria** (what must be TRUE):
  1. Navbar shows club crest and text navigation links (Home, Squad, Fixtures, News, Gallery, About) and remains visible when scrolling
  2. Mobile users see a polished slide-out menu with club branding and smooth open/close transitions
  3. Footer displays navigation links, social media icons, contact info, and current copyright year on every page
  4. Every page renders with a shared PageHero component showing page title and background image
  5. All layout components render correctly across mobile, tablet, and desktop viewports
**Plans**: TBD

Plans:
- [ ] 02-01: TBD
- [ ] 02-02: TBD

### Phase 3: Home Page
**Goal**: The home page works as the club's showpiece -- visitors land and immediately feel they are on a real football club's website
**Depends on**: Phase 2
**Requirements**: HOME-01, HOME-02, HOME-03, HOME-04, HOME-05, HOME-06, HOME-07
**Success Criteria** (what must be TRUE):
  1. Hero section displays a team photo or action shot with the club crest prominently visible
  2. Upcoming fixture shows opponent name, date, venue, and a live countdown timer
  3. Recent match results display as visual cards with team logos and scores
  4. Latest news section shows 2-3 articles with thumbnails and excerpts, and squad spotlight previews featured players
  5. Page sections animate into view on scroll with smooth Framer Motion transitions
**Plans**: TBD

Plans:
- [ ] 03-01: TBD
- [ ] 03-02: TBD

### Phase 4: Inner Pages
**Goal**: Every content page is complete and data-driven, giving the site the depth of a real football club website
**Depends on**: Phase 3
**Requirements**: PAGE-01, PAGE-02, PAGE-03, PAGE-04, PAGE-05, PAGE-06, PAGE-07, PAGE-08
**Success Criteria** (what must be TRUE):
  1. Squad page displays player cards grouped by position (GK, DEF, MID, FWD) and clicking a player opens their profile with photo, bio, stats, and position
  2. Fixtures & Results page shows upcoming matches and past results as styled match cards
  3. News listing page displays article cards with thumbnails, titles, and dates; clicking an article opens the full content with images
  4. Gallery page displays a photo grid and clicking a photo opens a lightbox viewer
  5. About page presents club history, mission, values, and coaching staff profiles
**Plans**: TBD

Plans:
- [ ] 04-01: TBD
- [ ] 04-02: TBD
- [ ] 04-03: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Design System | 0/3 | Planning complete | - |
| 2. Layout Shell | 0/0 | Not started | - |
| 3. Home Page | 0/0 | Not started | - |
| 4. Inner Pages | 0/0 | Not started | - |
