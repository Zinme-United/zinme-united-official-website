# Phase 3: Home Page - Research

**Researched:** 2026-05-04
**Domain:** React home page composition, scroll animations, countdown timers, data-driven sections
**Confidence:** HIGH

## Summary

Phase 3 redesigns the existing home page (`client/src/pages/home/Home.tsx`) which already has a working structure with hero, next match, news, squad spotlight, gallery preview, and partners sections. The existing components use Swiper for the hero carousel, `useActivities` / `useNews` / `usePlayers` / `useGalleries` hooks with TanStack Query for data fetching, and Tailwind CSS v4 with the club's design tokens. All data hooks and API endpoints are already functional.

The primary new work is: (1) adding a "recent results" section with score cards (no existing component), (2) restructuring the news section into a featured layout (1 large + 2 small), (3) changing squad spotlight from "first 5 players" to "1 per position group", (4) installing Motion (formerly Framer Motion) for scroll-triggered section animations, and (5) redesigning the hero section per user decisions. The existing `NextMatch` component already has a working countdown timer.

**Primary recommendation:** Refactor existing home page components in-place, add `motion` package for scroll animations, create a new `RecentResults` component for match result cards, and restructure existing components to match the CONTEXT decisions.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Single hero fixture card for the next match: opponent logo, date, venue, live countdown timer
- 3 recent results displayed as horizontal score cards showing team logos, score, and date
- Fixtures and results live in one combined "Matches" section -- next fixture on top, results below
- "View all fixtures" link to the fixtures page
- Featured layout: 1 large featured article card with image + 2 smaller cards below
- Each news card shows: thumbnail image, article title, 1-2 line excerpt, and publish date
- Clicking a news card navigates to the detail page (/news/:id)
- "View all news" link to the news listing page
- 4 player cards -- one per position group (GK, DEF, MID, FWD)
- Selection: first player listed in each position group from the data (deterministic)
- Each card shows: player photo, name, jersey number badge, and position label
- Clicking a player card navigates to their detail page (/squad/:id)
- "View full squad" link to the squad page
- Every section has a "View all" link to its respective inner page
- Individual cards link directly to detail pages (even if Phase 4 hasn't fully built them yet -- routes exist)

### Claude's Discretion
- Hero section design (full-screen vs partial, image choice, CTA buttons, overlay content)
- Section order and spacing rhythm on the page
- Scroll animation intensity and Framer Motion transitions
- Sponsors section layout
- Responsive breakpoint behavior
- Loading and empty states

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| HOME-01 | Hero section displays team photo/action shot with club crest prominently | Existing `HeroSection.tsx` uses Swiper carousel with 3 slides (zinme.jpg, zinme-group-photo.jpg, zinme-training.jpg). Club crest at `/ZMUTD Official.png`. Redesign in-place. |
| HOME-02 | Next match section shows upcoming fixture with opponent, date, venue, and countdown timer | Existing `NextMatch.tsx` already implements full countdown timer with `useEffect`/`setInterval`. Activity type has `opponent`, `date`, `time`, `location` fields. `useActivities({params: {isNextMatch: true}})` fetches it. |
| HOME-03 | Latest results section displays recent match scores as visual cards with team logos | **NEW component needed.** Activity type has `result` field (string), `homeTeamLogoUrl`, `opponentTeamLogoUrl`. Need to fetch past matches with results via `useActivities` with type="match" filter and filter for activities with a `result` field. |
| HOME-04 | Latest news section shows 2-3 recent articles with thumbnails and excerpts | Existing `LatestNewsAndUpdates.tsx` shows paginated grid. Needs restructuring to 1-large + 2-small featured layout. News type has `imageUrl`, `title`, `content`, `publishedAt`, `isFeatured`. |
| HOME-05 | Squad spotlight section previews featured players with links to squad page | Existing `SquadSpotlight.tsx` shows first 5 players. Needs change to 4 players (1 per position: GK, DEF, MID, FWD). Player type has `position` field. |
| HOME-06 | Partners/sponsors banner displays club sponsor logos | Existing `PartnersBanner.tsx` with hardcoded sponsors (Meeting Point main, Trust 8, Time On You, Marco Paing). Already functional, may need visual polish. |
| HOME-07 | Page sections animate in on scroll using Framer Motion | **NEW dependency.** Install `motion` package. Use `motion.div` with `whileInView` and `viewport={{ once: true }}` for reveal animations. |
</phase_requirements>

## Standard Stack

### Core (Already Installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react | ^19.1.0 | UI framework | Already in project |
| react-router | ^7.5.3 | Routing (Link, navigation) | Already in project |
| @tanstack/react-query | ^5.77.0 | Data fetching & caching | Already in project, all hooks use it |
| tailwindcss | ^4.1.5 | Styling with design tokens | Already in project with @theme config |
| lucide-react | ^0.508.0 | Icons | Already in project |
| date-fns | ^4.1.0 | Date formatting | Already in project |
| swiper | ^11.2.10 | Hero carousel | Already in project for HeroSection |

### New Dependency
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| motion | ^12.x | Scroll animations (whileInView) | The modern successor to framer-motion, 9.5M weekly downloads, required by HOME-07 |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| motion | CSS-only scroll animations | CSS `@starting-style` and `animation-timeline: view()` are not fully supported cross-browser yet; motion provides `whileInView` with fallbacks |
| motion | react-intersection-observer + CSS | More manual work, no spring physics, no orchestrated staggering |

**Installation:**
```bash
npm install motion
```

## Architecture Patterns

### Current Home Page Structure (What Exists)
```
Home.tsx
  -> HeroSection (Swiper carousel + floating next-match banner)
  -> NextMatch (countdown timer card)
  -> LatestNewsAndUpdates (paginated 3-column grid)
  -> SquadSpotlight (first 5 players grid)
  -> GalleryPreview (4 recent galleries)
  -> PartnersBanner (main + co-sponsors)
```

### Target Home Page Structure (What to Build)
```
Home.tsx
  -> HeroSection (redesigned: team photo with crest overlay, CTA)
  -> MatchesSection (NEW combined section)
     -> NextMatchCard (refactored from NextMatch, countdown)
     -> RecentResults (NEW: 3 horizontal score cards)
     -> "View all fixtures" link -> /activities
  -> LatestNews (refactored: 1 large + 2 small layout)
     -> "View all news" link -> /articles
  -> SquadSpotlight (refactored: 4 cards, 1 per position)
     -> "View full squad" link -> /players
  -> PartnersBanner (existing, visual polish)
```

### Pattern 1: Scroll Animation Wrapper
**What:** Reusable `AnimatedSection` component wrapping content with motion fade-in
**When to use:** Every major section on the home page
**Example:**
```typescript
// Source: motion.dev/docs/react-scroll-animations
import { motion } from "motion/react";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const AnimatedSection = ({ children, className, delay = 0 }: AnimatedSectionProps) => (
  <motion.section
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.section>
);
```

### Pattern 2: Position-Based Player Selection
**What:** Filter players by position group, take first from each
**When to use:** Squad spotlight section
**Example:**
```typescript
const positionGroups = ["Goalkeeper", "Defender", "Midfielder", "Forward"];
// Or matching whatever the API position strings are (GK, DEF, MID, FWD, etc.)

const spotlightPlayers = positionGroups
  .map(pos => players?.find(p => p.position === pos))
  .filter(Boolean);
```

### Pattern 3: Recent Results Fetch
**What:** Fetch past match activities that have a result field
**When to use:** RecentResults component
**Example:**
```typescript
const { activities: matches } = useActivities({
  params: { type: "match" },
  enabled: true,
});

const recentResults = matches
  ?.filter(m => m.result) // Only matches with results
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 3);
```

### Pattern 4: Route Mapping for Links
**What:** Map current routes to the routes decided in CONTEXT
**Critical note:** Current routes differ from CONTEXT decisions:
| CONTEXT says | Current route | Action |
|-------------|---------------|--------|
| `/news/:id` | `/articles/:id` | Use current route `/articles/:id` -- route renaming is out of scope |
| `/squad/:id` | `/player/:id` | Use current route `/player/:id` |
| News listing | `/articles` | Use current route `/articles` |
| Squad page | `/players` | Use current route `/players` |
| Fixtures page | `/activities` | Use current route `/activities` |

**Important:** The "View all" links should point to the EXISTING routes, not the conceptual route names from CONTEXT. Route renaming would be a Phase 4 concern.

### Anti-Patterns to Avoid
- **Full-page loading spinner for all data:** Current Home.tsx blocks rendering until `nextMatchLoading` completes. Each section should handle its own loading state independently.
- **Hardcoded player slice:** Current `players?.slice(0, 5)` ignores position groups. Must filter by position.
- **Pagination on home page news:** Current `LatestNewsAndUpdates` has pagination. Home page should show only 3 articles with no pagination.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scroll-triggered animations | Custom IntersectionObserver + CSS transitions | `motion` `whileInView` | Handles threshold, spring physics, stagger, once-only, and `prefers-reduced-motion` |
| Countdown timer | Custom from scratch | Existing `NextMatch.tsx` pattern | Already has working `useEffect`/`setInterval` with proper cleanup |
| Date formatting | Manual string manipulation | `date-fns` `format()` | Already used in `LatestNewsAndUpdates`, handles locales and edge cases |
| Image carousel | Custom slider | Swiper (already installed) | Already configured with autoplay, pagination, navigation |

## Common Pitfalls

### Pitfall 1: Stale Countdown After Tab Switch
**What goes wrong:** Countdown timer shows wrong values after user returns to tab
**Why it happens:** `setInterval` continues but display freezes when tab is backgrounded
**How to avoid:** The existing `NextMatch.tsx` already handles this with `refetchOnWindowFocus: true` on the query, and the interval recalculates from `Date.now()` each tick (not by decrementing). Keep this pattern.
**Warning signs:** Countdown jumps or shows negative values

### Pitfall 2: Activity `result` Field Format Unknown
**What goes wrong:** Result cards display garbled or unexpected format
**Why it happens:** The `Activity.result` type is `string | undefined` -- the format is not typed (could be "2-1", "W 3-0", etc.)
**How to avoid:** Check actual API data for result format. Build the result card to handle a simple string display initially. Parse score only if format is consistent.
**Warning signs:** Empty or oddly formatted result strings

### Pitfall 3: Player Position String Mismatch
**What goes wrong:** Squad spotlight shows 0 players because position strings don't match
**Why it happens:** Player `position` field is typed as `string` -- actual values could be "GK", "Goalkeeper", "goalkeeper", etc.
**How to avoid:** Log actual player position values from the API first. Use case-insensitive matching or map known values.
**Warning signs:** Empty spotlight section despite players existing

### Pitfall 4: News Route Mismatch
**What goes wrong:** "View all news" link goes to wrong page
**Why it happens:** CONTEXT says `/news/:id` but actual routes are `/articles/:id`
**How to avoid:** Always use the existing router paths: `/articles` for news list, `/articles/:id` for news detail, `/players` for squad, `/player/:id` for player detail, `/activities` for fixtures.
**Warning signs:** 404s when clicking links

### Pitfall 5: Motion Bundle Size
**What goes wrong:** Lighthouse performance score drops
**Why it happens:** Importing full motion library adds ~30-40KB gzipped
**How to avoid:** Import only from `motion/react` (tree-shakeable). Use simple `whileInView` rather than complex orchestration. Avoid importing `AnimatePresence` unless needed.
**Warning signs:** Bundle analyzer showing large motion chunks

### Pitfall 6: GalleryPreview Section Removal
**What goes wrong:** Gallery preview section still renders but wasn't mentioned in CONTEXT decisions
**Why it happens:** Current Home.tsx has GalleryPreview but CONTEXT decisions don't include a gallery section on the home page
**How to avoid:** The CONTEXT defines the home page sections as: Hero, Matches (next + results), News, Squad Spotlight, and Sponsors. Gallery preview is NOT listed. Remove it from the home page.
**Warning signs:** Extra section on page not matching design decisions

## Code Examples

### Scroll Animation with motion/react
```typescript
// Source: motion.dev/docs/react-scroll-animations
import { motion } from "motion/react";

// Fade up on scroll, only once
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.2 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
>
  {/* section content */}
</motion.div>
```

### Staggered Children Animation
```typescript
// Source: motion.dev/docs/react-quick-start
import { motion } from "motion/react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

<motion.div
  variants={containerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
>
  {items.map(item => (
    <motion.div key={item.id} variants={itemVariants}>
      {/* card content */}
    </motion.div>
  ))}
</motion.div>
```

### Section Header Pattern (Existing Convention)
```typescript
// Source: Existing codebase pattern from LatestNewsAndUpdates.tsx, SquadSpotlight.tsx
<div className="flex items-center justify-between mb-8">
  <div>
    <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-1">
      {subtitle}
    </p>
    <h2 className="text-3xl md:text-4xl font-extrabold text-primary">
      {title}
    </h2>
  </div>
  <Link
    to={linkTo}
    className="hidden sm:flex items-center text-sm font-semibold text-primary hover:text-primary-light transition-colors"
  >
    {linkText} <ChevronRight size={16} className="ml-1" />
  </Link>
</div>
```

### Result Score Card Pattern
```typescript
// Win/Loss/Draw indicator from result string
const getResultColor = (result: string) => {
  const upper = result.toUpperCase();
  if (upper.includes("W") || /* score parsing shows home > away */) return "bg-green-500";
  if (upper.includes("L") || /* score parsing shows home < away */) return "bg-red-500";
  return "bg-gray-400"; // Draw
};
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `framer-motion` package | `motion` package | 2025 | Import from `motion/react` not `framer-motion` |
| `animate` + IntersectionObserver | `whileInView` prop | framer-motion v5+ | Built-in scroll trigger, no manual observer |
| Full library import | Tree-shakeable `motion/react` | motion v11+ | Smaller bundles when using specific features |

**Deprecated/outdated:**
- `framer-motion` package: Still works but `motion` is the maintained successor. Use `motion` for new installs.
- `useAnimation` + `useInView`: The `whileInView` prop replaces this pattern for simple scroll reveals.

## Open Questions

1. **Activity `result` field format**
   - What we know: `result` is `string | undefined` on the Activity type
   - What's unclear: The actual format of result strings from the API (e.g., "2-1", "W 3-0", "Zinme United 2 - Opponent 1")
   - Recommendation: Build result card to display the raw string. If parsing is needed for win/loss coloring, examine actual API responses during implementation.

2. **Player position field values**
   - What we know: `position` is `string` type
   - What's unclear: Exact string values used (e.g., "Goalkeeper" vs "GK" vs "goalkeeper")
   - Recommendation: Log position values at runtime, then build the filter. Use a mapping object for flexibility.

3. **Fetching recent results separately**
   - What we know: `useActivities` can filter by type via params
   - What's unclear: Whether the API supports filtering for "matches with results" directly, or if client-side filtering of all matches is needed
   - Recommendation: Fetch with `{ type: "match" }` and filter client-side for `activity.result` being truthy. Limit to 3 most recent.

## Sources

### Primary (HIGH confidence)
- Project codebase: `client/src/pages/home/Home.tsx`, all component files, hooks, types -- direct code inspection
- [Motion official docs](https://motion.dev/docs/react-scroll-animations) -- `whileInView`, viewport options, scroll animations
- [Motion npm page](https://www.npmjs.com/package/motion) -- v12.38.0, install instructions

### Secondary (MEDIUM confidence)
- [Motion React Quick Start](https://motion.dev/docs/react-quick-start) -- import patterns, basic usage

### Tertiary (LOW confidence)
- Activity `result` field format -- only type definition available, no API response samples inspected

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all libraries already in use except motion, which is well-documented
- Architecture: HIGH -- refactoring existing components with clear data types and hooks
- Pitfalls: HIGH -- identified from direct code inspection of current implementation
- Result card data format: LOW -- Activity.result string format unverified

**Research date:** 2026-05-04
**Valid until:** 2026-06-04 (stable stack, no fast-moving dependencies)
