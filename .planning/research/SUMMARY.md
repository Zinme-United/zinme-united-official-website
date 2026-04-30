# Research Summary: Zinme United Website Redesign

**Synthesized:** 2026-05-01
**Sources:** STACK.md, FEATURES.md, ARCHITECTURE.md, PITFALLS.md

## Key Findings

### Stack
The existing React + Vite + Tailwind stack is fully capable. No framework migration needed. Key additions: **Framer Motion** for animations, **custom web fonts** for typography (biggest visual impact), and a **proper Tailwind theme config** to consolidate 5-6 scattered hardcoded blues into semantic color tokens. Cleanup: consolidate dual date libraries (date-fns + dayjs) and dual icon libraries (lucide-react + react-icons).

### Table Stakes
Football club websites follow a well-established convention: **hero with club imagery**, **text-based navigation** ("Squad", "Fixtures", "News"), **next match display**, **latest results**, **squad grouped by position**, **news with thumbnails**, **gallery**, and **club info page**. All data for these features already exists in the codebase via existing API endpoints.

### Architecture
The redesign is purely frontend — existing React Query hooks and Express API remain untouched. Build order must be: **design system first** (colors, fonts, spacing tokens), then **layout shell** (navbar, footer, page hero), then **home page**, then **inner pages**, then **polish/animations**. Every page should follow a shared layout pattern for consistency.

### Watch Out For
1. **Hardcoded hex colors everywhere** — must consolidate before building components
2. **Generic carousel copy** ("Unleash the Passion") — needs real club content
3. **System fonts** — single highest-impact fix for professional appearance
4. **Icon-based navigation** — football sites use text labels, not icons
5. **Image quality** — external dependency that can undermine the entire redesign
6. **Scope creep into backend** — this is frontend-only, transform data in components if needed

## Recommended Phase Structure

| Phase | Focus | Pitfalls Addressed |
|-------|-------|--------------------|
| 1. Design System | Colors, fonts, spacing, shared tokens | Scattered colors, system fonts, duplicate libraries |
| 2. Layout Shell | Navbar, footer, page hero, section headers | Icon nav, broken footer, mobile nav, inconsistency |
| 3. Home Page | Hero, fixtures, results, news, squad spotlight | Generic copy, image quality |
| 4. Inner Pages | Squad, Fixtures, News, Gallery, About | Empty states, image quality |
| 5. Polish | Animations, loading states, responsive QA | Generic spinners, scroll effects |

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Low-quality team photos | Medium | High | Ensure photos exist before building hero/player cards |
| Scope creep to backend | Medium | Medium | Strict frontend-only rule; transform data in hooks |
| Inconsistent styling | High (current state) | High | Design system phase must be completed first |
| Mobile experience neglected | Medium | High | Design mobile-first, test throughout |

## Open Questions

1. What quality are the existing team/player photos?
2. Does the club have sponsor/partner logos ready?
3. Is coaching staff data populated in the database?
4. How many fixtures/results exist? (Empty pages look worse than no pages)

---
*Research synthesis: 2026-05-01*
