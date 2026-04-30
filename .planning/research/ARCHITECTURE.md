# Architecture Research: Football Club Website Redesign

**Project:** Zinme United Official Website Redesign
**Mode:** Ecosystem (Architecture dimension)
**Confidence:** HIGH

## Component Architecture

### Shared Layout Components (Build First)

These components appear on every page and define the site's identity.

| Component | Purpose | Notes |
|-----------|---------|-------|
| **Navbar** | Site navigation with club crest, page links, mobile menu | Must follow football convention: text labels ("Squad", "Fixtures", "News"), not icon-based |
| **Footer** | Club info, social links, sponsors, copyright | Should include quick nav links, contact info, social media icons |
| **PageHero** | Reusable hero banner per page | Each page gets a hero with page title, optional subtitle, background image/gradient |
| **SectionHeader** | Consistent section title pattern | Reused across home page sections and inner pages |

### Home Page Components

| Component | Data Source | Notes |
|-----------|------------|-------|
| **HeroSection** | Static + dynamic (next match) | Full-width hero with team photo/crest, optional next match overlay |
| **NextMatchBanner** | Activities API (filtered for matches) | Countdown timer, opponent, date, venue |
| **LatestResults** | Activities API (past matches) | Score cards with team logos |
| **SquadSpotlight** | Players API | Featured player cards or "Meet the Squad" preview |
| **LatestNews** | News API (limit 3) | News cards with thumbnail, title, date |
| **AboutPreview** | Our Club API | Brief club description with CTA to full about page |
| **PartnersBar** | Static or API | Sponsor/partner logo strip |

### Inner Page Components

| Page | Key Components | Data Source |
|------|---------------|------------|
| **Squad** | PlayerCard, PositionGroup, PlayerModal/Page | Players API |
| **Fixtures & Results** | MatchCard, FixturesList, ResultsList, tabs/filters | Activities API |
| **News** | NewsCard, NewsGrid, ArticlePage | News API |
| **Gallery** | GalleryGrid, AlbumCard, Lightbox | Gallery API |
| **About** | ClubHistory, MissionValues, CoachingStaff | Our Club API + Coaches API |

### Utility Components

| Component | Purpose |
|-----------|---------|
| **MatchCard** | Reused in home page results + fixtures page — shows two teams, score, date |
| **PlayerCard** | Reused in home spotlight + squad page — shows photo, name, position, number |
| **NewsCard** | Reused in home news + news listing — shows thumbnail, title, excerpt, date |
| **LoadingState** | Club-branded loading indicator (replaces generic spinners) |
| **EmptyState** | "No fixtures yet" / "No news" branded placeholder |

## Data Flow

```
MongoDB → Express API → Axios (React Query) → Components

Existing API endpoints (no changes needed):
  GET /api/players         → Squad page, Home spotlight
  GET /api/activities      → Fixtures page, Home results/next match
  GET /api/news            → News page, Home latest news
  GET /api/galleries       → Gallery page
  GET /api/our-club        → About page, Home about preview
  GET /api/coaches         → About page coaching staff
```

**Key:** All data fetching already works via React Query hooks (`usePlayers`, `useActivities`, `useNews`, `useGalleries`, `useOurClub`). The redesign only changes how data is rendered, not how it's fetched.

## Page Layout Pattern

Every public page follows this structure:

```
<Navbar />
<PageHero title="..." backgroundImage="..." />
<main>
  <Section>
    <SectionHeader title="..." />
    <Content />
  </Section>
  ...
</main>
<Footer />
```

This ensures visual consistency across all pages.

## Build Order (Dependencies)

```
Phase 1: Design System
├── Tailwind theme config (colors, fonts, spacing)
├── CSS custom properties for brand tokens
└── Base typography and spacing established

Phase 2: Layout Shell
├── Navbar (depends on: design system)
├── Footer (depends on: design system)
├── PageHero (depends on: design system)
└── SectionHeader (depends on: design system)

Phase 3: Home Page
├── HeroSection (depends on: layout shell)
├── NextMatchBanner (depends on: Activities data)
├── LatestResults (depends on: MatchCard)
├── SquadSpotlight (depends on: PlayerCard)
├── LatestNews (depends on: NewsCard)
└── AboutPreview (depends on: design system)

Phase 4: Inner Pages
├── Squad page (depends on: PlayerCard, layout shell)
├── Fixtures page (depends on: MatchCard, layout shell)
├── News page (depends on: NewsCard, layout shell)
├── Gallery page (depends on: layout shell)
└── About page (depends on: layout shell)

Phase 5: Polish
├── Page transitions (depends on: all pages)
├── Scroll animations (depends on: all pages)
├── Responsive refinement (depends on: all pages)
└── Loading/empty states (depends on: design system)
```

## Integration Points

- **Admin panel**: Left completely untouched — it's functional and not part of public redesign
- **Authentication**: No changes — auth flow stays as-is for admin access
- **API layer**: No changes — existing hooks and endpoints are sufficient
- **Router**: May need route additions if player detail pages don't exist yet

## Responsive Strategy

| Breakpoint | Layout Approach |
|-----------|----------------|
| Mobile (< 768px) | Single column, hamburger nav, stacked cards |
| Tablet (768-1024px) | 2-column grids, condensed hero |
| Desktop (> 1024px) | Full layout, multi-column grids, large hero |

All football club sites are mobile-first — many fans browse on phones.

---
*Architecture research: 2026-05-01*
