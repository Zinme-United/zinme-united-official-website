# Phase 4: Inner Pages - Research

**Researched:** 2026-05-04
**Domain:** React page components, data-driven UI, lightbox, masonry grid, page transitions
**Confidence:** HIGH

## Summary

Phase 4 is a UI redesign of 5 existing content pages (Squad, Player Detail, Fixtures & Results, News/Article, Gallery, About) plus creation of one missing page (Gallery listing at `/gallery`). All pages already exist with functional data fetching via TanStack Query hooks and backend API integration. The work is purely visual -- restyling existing pages to match the Phase 1-3 design system (Tailwind v4 tokens, font-heading, primary/accent colors, shadow-card, etc.) and adding missing features like masonry layout, proper position grouping, pagination, and page transitions.

The existing codebase uses React 19, react-router v7, TanStack Query v5, Tailwind v4, motion (Framer Motion), date-fns, and lucide-react. No new dependencies are needed except possibly a masonry CSS approach. The lightbox is already custom-built in GalleryDetailsPage with keyboard navigation -- it just needs visual polish and to be used from a new flat gallery listing page.

**Primary recommendation:** Restyle existing page components using design system tokens from Phase 1, group squad by position categories, create a new `/gallery` listing page that aggregates all gallery images into a flat masonry grid with the existing lightbox, redesign Activities into a proper Fixtures & Results page with tabs, add pagination to news, and wrap sections in AnimatedSection + page transitions via motion.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Squad page: Players grouped by position (GK, DEF, MID, FWD) with section headers. Gender tabs (Men's/Women's). Player cards use same style as home page spotlight. Clicking navigates to player detail.
- Player detail page: Full profile with large photo, bio, stats (age, kit number, appearances). Pitch position map using existing positionToMarkers utility. Polish existing structure.
- Fixtures & results page: Two tabs "Upcoming" and "Results". Match cards show team logos, names, date/time, venue. Result cards show score with win/draw/loss color indicator. No league standings table.
- News listing page: Card grid 3 columns desktop, 2 tablet, 1 mobile. Each card shows thumbnail, title, excerpt, date. Pagination 9-12 articles per page.
- Article detail page: Large hero image, title, publish date, full HTML content. "More News" section at bottom with 2-3 related cards. Back-to-news navigation.
- Gallery page: Masonry grid (Pinterest-style) for photos of varying sizes. Flat grid, no album/event grouping.
- Lightbox viewer: Fullscreen overlay, left/right arrow navigation, close button, caption, keyboard navigation (arrows, escape).
- About page: Minimal -- club history and mission/values. No coaching staff profiles.

### Claude's Discretion
- Responsive breakpoint behavior for all pages
- Loading states and skeleton screens
- Empty state messaging
- Search/filter on squad page (beyond gender tabs)
- Animation and transition details
- Lightbox implementation approach (custom vs library)

### Deferred Ideas (OUT OF SCOPE)
None
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PAGE-01 | Squad page shows player cards grouped by position (GK, DEF, MID, FWD) | Existing Players.tsx has gender tabs and search/filter. Needs position grouping with section headers using positionGroupMap from SquadSpotlight. |
| PAGE-02 | Individual player profile pages display photo, bio, stats, and position | Existing PlayerDetails.tsx is fully built with hero, stats bar, bio, pitch map. Needs design system token alignment. |
| PAGE-03 | Fixtures & Results page shows upcoming matches and past results with match cards | Existing Activities.tsx uses EventCalendar + GalleriesCard. Needs full redesign with Upcoming/Results tabs and match cards. |
| PAGE-04 | News listing page displays articles as cards with thumbnails, titles, dates | Existing ArticlesPage.tsx has featured hero + grid. Needs pagination (9-12 per page) and design token alignment. |
| PAGE-05 | Individual news article page renders full content with images | Existing ArticlesDetails.tsx has hero image, progress bar, body. Needs "More News" section at bottom. |
| PAGE-06 | Gallery page displays photo grid with lightbox viewer | GalleryDetailsPage.tsx has lightbox + grid for single gallery. Need NEW `/gallery` page aggregating all gallery images into flat masonry grid. |
| PAGE-07 | About page presents club history, mission, values, and coaching staff profiles | Existing ClubPage.tsx has history, values, milestones, goals. No coaching staff needed per user decision. Polish only. |
| PAGE-08 | Smooth animated transitions between pages using Framer Motion | AnimatedSection component exists. Need page-level enter/exit transitions using motion's AnimatePresence. |
</phase_requirements>

## Standard Stack

### Core (Already Installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.1.0 | UI framework | Already in project |
| react-router | 7.5.3 | Routing | Already in project, createBrowserRouter |
| @tanstack/react-query | 5.77.0 | Data fetching | Already in project, all hooks built |
| tailwindcss | 4.1.5 | Styling | Already in project with design tokens |
| motion | 12.38.0 | Animations | Already in project (Framer Motion) |
| date-fns | 4.1.0 | Date formatting | Already in project |
| lucide-react | 0.508.0 | Icons | Already in project |

### Supporting (Already Installed)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @headlessui/react | 2.2.7 | Accessible UI primitives | Tab components for Fixtures and Squad tabs |
| axios | 1.9.0 | HTTP client | Already used by all hooks via axiosInstance |

### No New Dependencies Needed
| Problem | Solution |
|---------|----------|
| Masonry layout | CSS columns (`column-count`) -- native CSS, no library needed |
| Lightbox | Already custom-built in GalleryDetailsPage.tsx -- reuse/extract |
| Pagination | Simple client-side state (page number + slice) -- no library needed |
| Page transitions | motion's AnimatePresence already available |
| Tabs | @headlessui/react Tab component already installed |

## Architecture Patterns

### Current Page Structure (Each Page)
```
src/pages/{page-name}/
  PageComponent.tsx       # Single file per page
```

### Key Existing Patterns to Follow
```
- PageHero at top of every page (breadcrumbs + title)
- useXxx hooks for all data fetching (usePlayers, useActivities, useNews, useGalleries, useGetGalleryById)
- Loader component for loading states
- Design tokens: bg-surface, bg-surface-alt, bg-primary-dark, text-primary, text-accent, text-text-muted
- Container: max-w-[var(--container-content)] mx-auto px-4 sm:px-6
- Cards: rounded-[var(--radius-card)] shadow-card hover:shadow-card-hover
- Headings: font-heading uppercase tracking-wide
- AnimatedSection wrapper for scroll-triggered animations
```

### Pattern 1: Position Grouping for Squad Page
**What:** Group players by position category using the same mapping from SquadSpotlight
**When to use:** Squad page (PAGE-01)
**Example:**
```typescript
// Reuse the position group mapping from SquadSpotlight
const positionGroupMap: Record<string, string[]> = {
  Goalkeepers: ["GK"],
  Defenders: ["CB", "LB", "RB", "LWB", "RWB", "SW"],
  Midfielders: ["CM", "DM", "AM", "LM", "RM", "CDM", "CAM"],
  Forwards: ["ST", "CF", "LW", "RW", "SS"],
};

// Group filtered players
const groupedPlayers = Object.entries(positionGroupMap).map(([label, abbrevs]) => ({
  label,
  players: filteredPlayers.filter(p =>
    abbrevs.includes(p.position.replace(/\./g, "").toUpperCase().trim())
  ),
})).filter(g => g.players.length > 0);
```

### Pattern 2: Masonry Grid via CSS Columns
**What:** Pinterest-style grid using native CSS column-count
**When to use:** Gallery page (PAGE-06)
**Example:**
```typescript
<div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
  {images.map((img, i) => (
    <button
      key={img.url + i}
      onClick={() => openLightbox(i)}
      className="break-inside-avoid rounded-[var(--radius-card)] overflow-hidden shadow-card hover:shadow-card-hover transition-all cursor-zoom-in"
    >
      <img src={img.url} alt={img.caption || ""} className="w-full" loading="lazy" />
    </button>
  ))}
</div>
```

### Pattern 3: Client-Side Pagination
**What:** Simple page state with array slicing
**When to use:** News listing page (PAGE-04)
**Example:**
```typescript
const ITEMS_PER_PAGE = 9;
const [page, setPage] = useState(1);
const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
const paginatedArticles = filteredArticles.slice(
  (page - 1) * ITEMS_PER_PAGE,
  page * ITEMS_PER_PAGE
);
```

### Pattern 4: Tab Component with @headlessui/react
**What:** Accessible tabs for Fixtures (Upcoming/Results) and Squad (Men's/Women's)
**When to use:** PAGE-01, PAGE-03
**Example:**
```typescript
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

<TabGroup>
  <TabList className="inline-flex rounded-2xl bg-white/10 p-1 backdrop-blur-sm border border-white/20">
    <Tab className={({ selected }) =>
      `px-5 py-2.5 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
        selected ? "bg-white text-primary shadow" : "text-white/80 hover:bg-white/10"
      }`
    }>
      Upcoming
    </Tab>
    <Tab>Results</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>{/* Upcoming matches */}</TabPanel>
    <TabPanel>{/* Results */}</TabPanel>
  </TabPanels>
</TabGroup>
```

### Pattern 5: Page Transitions with AnimatePresence
**What:** Wrap route outlet with AnimatePresence for enter/exit animations
**When to use:** PAGE-08 -- applied at layout level
**Example:**
```typescript
import { AnimatePresence, motion } from "motion/react";
import { useLocation, Outlet } from "react-router";

const PublicLayout = () => {
  const location = useLocation();
  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
    </>
  );
};
```

### Anti-Patterns to Avoid
- **Hardcoded hex colors:** Use design tokens (bg-primary, text-accent, etc.) -- never raw hex values
- **max-w-7xl instead of container token:** Use `max-w-[var(--container-content)]` for content sections
- **Building new data hooks:** All API hooks exist -- reuse `useActivities`, `usePlayers`, `useNews`, `useGalleries`, `useGetGalleryById`
- **bg-white instead of bg-surface:** Use semantic tokens `bg-surface` and `bg-surface-alt` for backgrounds
- **Installing masonry/lightbox libraries:** CSS columns for masonry, existing custom lightbox for gallery -- no new deps

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Data fetching | Custom fetch/state | Existing TanStack Query hooks (usePlayers, useActivities, etc.) | Already built, cached, error handling included |
| Accessible tabs | Custom tab state | @headlessui/react Tab components | Already installed, handles ARIA, keyboard nav |
| Position mapping | New position logic | positionGroupMap from SquadSpotlight + positionToMarkers util | Already proven pattern in codebase |
| Date formatting | Manual date strings | date-fns format() | Already used everywhere in codebase |
| Loading spinners | Custom spinners | Existing Loader component | Already built, consistent |
| Page hero | Custom hero per page | PageHero component | Already built in Phase 2 |
| Scroll animations | Custom intersection observer | AnimatedSection component | Already built, consistent timing |

## Common Pitfalls

### Pitfall 1: Gallery Route Mismatch
**What goes wrong:** Navbar links to `/gallery` but no route exists. Only `/gallery-details/:id` exists for individual galleries.
**Why it happens:** The gallery listing page was never created -- only the detail page for specific galleries.
**How to avoid:** Create a new Gallery listing page component and add a `/gallery` route in App.tsx. This page aggregates ALL images from ALL galleries into a flat masonry grid.
**Warning signs:** Clicking "Gallery" in navbar shows 404 page.

### Pitfall 2: Position String Matching
**What goes wrong:** Player positions like "C.M." or "cm" don't match the position group map.
**Why it happens:** Backend stores positions as abbreviations but with inconsistent casing/dots.
**How to avoid:** Normalize with `.replace(/\./g, "").toUpperCase().trim()` before matching, exactly as SquadSpotlight does.
**Warning signs:** "Uncategorized" players or empty position groups.

### Pitfall 3: Activities Page is Not a Fixtures Page
**What goes wrong:** Current Activities.tsx shows an EventCalendar + GalleriesCard -- not a fixtures/results page.
**Why it happens:** The page was designed for all activities (events, training, matches) not just fixtures.
**How to avoid:** Redesign completely: filter for `type === "match"` only, split into Upcoming (no result) and Results (has result) tabs, style as match cards.
**Warning signs:** Calendar and gallery sections appearing on what should be a fixtures page.

### Pitfall 4: Missing "More News" on Article Detail
**What goes wrong:** ArticlesDetails page has no related articles section.
**Why it happens:** The existing component only renders the single article.
**How to avoid:** Use the existing `useNews` hook to fetch all articles, filter out current article, take 2-3 most recent, render as cards at the bottom.
**Warning signs:** Article page ends abruptly without navigation to other content.

### Pitfall 5: Players Page Has Its Own Hero Section
**What goes wrong:** Players.tsx has a custom hero with integrated filters (search, position pills, gender tabs) that conflicts with PageHero.
**Why it happens:** It was built before the shared PageHero existed.
**How to avoid:** Either replace with PageHero + separate filter bar below it, or keep the integrated hero but ensure it uses design tokens. The user decision says to keep gender tabs, so the integrated approach may be better -- just restyle with tokens.
**Warning signs:** Inconsistent hero appearance vs other pages.

### Pitfall 6: Page Transitions with createBrowserRouter
**What goes wrong:** AnimatePresence exit animations don't work with createBrowserRouter because React Router unmounts the old page before exit can run.
**Why it happens:** createBrowserRouter doesn't support AnimatePresence natively.
**How to avoid:** Use a simpler approach: animate on entry only (no exit), or use motion's layout animations. For "smooth transitions" (PAGE-08), entry animations are sufficient and reliable.
**Warning signs:** Flash/jump between pages, no visible exit animation.

## Code Examples

### Match Card Component (Fixtures Page)
```typescript
// Upcoming match card
const UpcomingMatchCard = ({ match }: { match: Activity }) => (
  <div className="bg-surface rounded-[var(--radius-card)] shadow-card p-5 flex items-center gap-4">
    <img src={match.homeTeamLogoUrl || defaultHomeLogo} alt="Home" className="w-12 h-12 object-contain" />
    <div className="flex-1 text-center">
      <p className="text-xs text-text-muted uppercase tracking-wider">
        {format(new Date(match.date), "EEE, MMM d")} {match.time && `- ${match.time}`}
      </p>
      <p className="font-heading text-lg text-primary mt-1">
        Zinme United <span className="text-text-muted mx-2">vs</span> {match.opponent || "TBA"}
      </p>
      {match.location && (
        <p className="text-xs text-text-muted mt-1 flex items-center justify-center gap-1">
          <MapPin size={12} /> {match.location}
        </p>
      )}
    </div>
    <img src={match.opponentTeamLogoUrl || opponentPlaceholder(match.opponent)} alt="Away" className="w-12 h-12 object-contain" />
  </div>
);

// Result match card (reuse resultBorderColor from MatchesSection)
const ResultMatchCard = ({ match }: { match: Activity }) => {
  const borderColor = resultBorderColor(match.result);
  return (
    <div className={`bg-surface rounded-[var(--radius-card)] shadow-card border-l-4 ${borderColor} p-5 flex items-center gap-4`}>
      {/* Similar to UpcomingMatchCard but with score display */}
    </div>
  );
};
```

### Extracting Lightbox as Reusable Component
```typescript
// Extract from GalleryDetailsPage into a shared component
interface LightboxProps {
  images: { url: string; caption?: string }[];
  selectedIndex: number | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}
// Reuse the exact lightbox JSX from GalleryDetailsPage.tsx (lines 129-194)
```

### Splitting Activities into Upcoming/Results
```typescript
const { activities } = useActivities({ params: { type: "match" } });

const upcoming = useMemo(() =>
  (activities || [])
    .filter(a => !a.result)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
  [activities]
);

const results = useMemo(() =>
  (activities || [])
    .filter(a => a.result)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  [activities]
);
```

## State of the Art

| Old Approach (Current) | Current Approach (Phase 4) | Impact |
|------------------------|---------------------------|--------|
| Activities page shows calendar + galleries | Fixtures page with Upcoming/Results tabs | Complete redesign needed |
| Gallery only accessible via /gallery-details/:id | New /gallery listing page with flat masonry grid | New route + page needed |
| No position grouping on squad page | Players grouped by GK/DEF/MID/FWD with headers | Moderate restructure |
| No pagination on news | Client-side pagination (9 per page) | Add pagination state |
| No "More News" on article detail | Related articles section at bottom | Add section to existing page |
| No page transitions | motion entry animations on page mount | Wrap Outlet in motion.main |

## Open Questions

1. **Gallery route path: `/gallery` vs `/gallery-details`**
   - What we know: Navbar links to `/gallery`. Gallery detail pages are at `/gallery-details/:id`.
   - What's unclear: Should the new gallery listing page be at `/gallery` (matching navbar)?
   - Recommendation: Yes, create route at `/gallery` to match the navbar link. Keep `/gallery-details/:id` for individual gallery detail pages (though the flat gallery may make this less used).

2. **Flat gallery: aggregate all galleries or single source?**
   - What we know: User wants "flat grid, all photos together, no album/event grouping." The API returns galleries as collections (each with multiple images).
   - What's unclear: Do we flatten ALL images from ALL galleries into one grid?
   - Recommendation: Yes, use `useGalleries` to fetch all galleries, then flatMap all images into a single array for the masonry grid.

3. **Fixtures type filter**
   - What we know: Activities API supports `type` filter. Activities can be "match", "training", or "event".
   - What's unclear: Should the Fixtures page fetch only `type=match` or all activities?
   - Recommendation: Filter `type=match` only, since the page is specifically "Fixtures & Results" not a general activities calendar.

## Sources

### Primary (HIGH confidence)
- Codebase inspection: All existing page components, hooks, types, routing, and shared components
- `client/package.json` - dependency versions confirmed
- `client/src/types/index.d.ts` - all TypeScript interfaces for Player, Activity, News, Gallery
- `client/src/hooks/` - all data fetching hooks verified
- `client/src/components/AnimatedSection.tsx` - motion/react import pattern
- `client/src/components/SquadSpotlight.tsx` - position group mapping pattern
- `client/src/components/MatchesSection.tsx` - result border color, match card patterns
- `client/src/constants/index.ts` - nav links confirming routes

### Secondary (MEDIUM confidence)
- CSS columns for masonry: well-supported native CSS feature, widely documented

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - all dependencies already installed, no new libraries needed
- Architecture: HIGH - all existing patterns inspected from codebase, clear what needs to change
- Pitfalls: HIGH - identified from actual code inspection (route mismatch, position strings, Activities vs Fixtures)

**Research date:** 2026-05-04
**Valid until:** 2026-06-04 (stable -- no external dependencies changing)
