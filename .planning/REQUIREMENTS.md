# Requirements: Zinme United Website Redesign

**Defined:** 2026-05-01
**Core Value:** Visitors land on the site and immediately feel they're on a legitimate football club's website

## v1 Requirements

### Design System

- [x] **DSGN-01**: Site uses unified color palette with club colors defined in Tailwind config (no hardcoded hex values)
- [x] **DSGN-02**: Site uses custom typography with bold heading font and clean body font
- [x] **DSGN-03**: All pages use consistent spacing, container widths, and section padding via shared tokens
- [x] **DSGN-04**: Duplicate libraries consolidated (single date library, single icon library)

### Navigation & Layout

- [x] **NAVL-01**: Navbar displays club crest and text-based navigation links (Home, Squad, Fixtures, News, Gallery, About)
- [x] **NAVL-02**: Navbar is sticky/fixed and stays visible on scroll
- [x] **NAVL-03**: Footer includes navigation links, social media icons, contact info, and dynamic copyright year
- [x] **NAVL-04**: Every page uses a shared PageHero component with title and background
- [x] **NAVL-05**: Mobile navigation is a polished slide-out menu with club branding and smooth transitions
- [x] **NAVL-06**: All pages are fully responsive across mobile, tablet, and desktop

### Home Page

- [x] **HOME-01**: Hero section displays team photo/action shot with club crest prominently
- [x] **HOME-02**: Next match section shows upcoming fixture with opponent, date, venue, and countdown timer
- [x] **HOME-03**: Latest results section displays recent match scores as visual cards with team logos
- [x] **HOME-04**: Latest news section shows 2-3 recent articles with thumbnails and excerpts
- [x] **HOME-05**: Squad spotlight section previews featured players with links to squad page
- [x] **HOME-06**: Partners/sponsors banner displays club sponsor logos
- [x] **HOME-07**: Page sections animate in on scroll using Framer Motion

### Inner Pages

- [x] **PAGE-01**: Squad page shows player cards grouped by position (GK, DEF, MID, FWD)
- [x] **PAGE-02**: Individual player profile pages display photo, bio, stats, and position
- [x] **PAGE-03**: Fixtures & Results page shows upcoming matches and past results with match cards
- [x] **PAGE-04**: News listing page displays articles as cards with thumbnails, titles, dates
- [x] **PAGE-05**: Individual news article page renders full content with images
- [x] **PAGE-06**: Gallery page displays photo grid with lightbox viewer for enlarging images
- [x] **PAGE-07**: About page presents club history, mission, values, and coaching staff profiles
- [x] **PAGE-08**: Smooth animated transitions between pages using Framer Motion

## v2 Requirements

### Enhanced Interactions

- **ENHC-01**: Interactive squad formation view (pitch visualization with player positions)
- **ENHC-02**: Social media feed integration on home page
- **ENHC-03**: Match day photo galleries linked to specific fixtures

## Out of Scope

| Feature | Reason |
|---------|--------|
| E-commerce / merchandise shop | High complexity, not core to club identity |
| Member login / fan accounts | Adds auth complexity for public users |
| Live match updates / scores | Beyond amateur team capability to maintain |
| Forum / comments | Moderation burden inappropriate for amateur club |
| Video streaming | Storage/bandwidth costs too high |
| Push notifications | Overkill for amateur site traffic |
| Ticket purchasing | Amateur teams don't typically sell tickets online |
| Multi-language support | Not requested, adds significant complexity |
| Backend/API changes | All data already exists, frontend-only redesign |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DSGN-01 | Phase 1 | Complete |
| DSGN-02 | Phase 1 | Complete |
| DSGN-03 | Phase 1 | Complete |
| DSGN-04 | Phase 1 | Complete |
| NAVL-01 | Phase 2 | Complete |
| NAVL-02 | Phase 2 | Complete |
| NAVL-03 | Phase 2 | Complete |
| NAVL-04 | Phase 2 | Complete |
| NAVL-05 | Phase 2 | Complete |
| NAVL-06 | Phase 2 | Complete |
| HOME-01 | Phase 3 | Complete |
| HOME-02 | Phase 3 | Complete |
| HOME-03 | Phase 3 | Complete |
| HOME-04 | Phase 3 | Complete |
| HOME-05 | Phase 3 | Complete |
| HOME-06 | Phase 3 | Complete |
| HOME-07 | Phase 3 | Complete |
| PAGE-01 | Phase 4 | Complete |
| PAGE-02 | Phase 4 | Complete |
| PAGE-03 | Phase 4 | Complete |
| PAGE-04 | Phase 4 | Complete |
| PAGE-05 | Phase 4 | Complete |
| PAGE-06 | Phase 4 | Complete |
| PAGE-07 | Phase 4 | Complete |
| PAGE-08 | Phase 4 | Complete |

**Coverage:**
- v1 requirements: 24 total
- Mapped to phases: 24
- Unmapped: 0

---
*Requirements defined: 2026-05-01*
*Last updated: 2026-05-01 after initial definition*
