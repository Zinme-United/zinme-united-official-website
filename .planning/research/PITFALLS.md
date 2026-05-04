# Pitfalls Research: Football Club Website Redesign

**Project:** Zinme United Official Website Redesign
**Mode:** Ecosystem (Pitfalls dimension)
**Confidence:** HIGH (grounded in codebase analysis)

## Critical Pitfalls

### 1. Inconsistent Visual Language Across Pages
**Risk:** HIGH
**Current evidence:** Home page uses `max-w-6xl`, Players uses `max-w-screen-xl`, Articles uses `max-w-7xl`. Section headers, hero treatments, and card styles differ on every page.

**Warning signs:** Different container widths, inconsistent section padding, varying card border-radius between pages.

**Prevention:** Create shared layout components (PageHero, SectionHeader, PageContainer) with fixed width/padding tokens. Every page uses the same wrapper.

**Phase:** Design System (Phase 1)

---

### 2. Scattered Hardcoded Colors
**Risk:** HIGH
**Current evidence:** At least 5-6 distinct blues (`#003b75`, `#0b4e8a`, `#001529`, `#0056b3`, `#001e3a`) hardcoded across components instead of using Tailwind config.

**Warning signs:** `grep -r "#00" client/src/` returns dozens of hits with different hex values that should be the same color.

**Prevention:** Define all club colors in Tailwind config as semantic tokens (`club-primary`, `club-secondary`, `club-dark`). Search and replace all hardcoded hex values. Add a linting rule or PR review check.

**Phase:** Design System (Phase 1)

---

### 3. Generic Loading Spinners
**Risk:** MEDIUM
**Current evidence:** Every page shows a centered `<Loader />` component while data fetches. Full-page spinners are the biggest "web app, not website" signal.

**Warning signs:** White screen → spinner → content flash on every page load.

**Prevention:** Replace with skeleton loaders that match the page layout, or use Suspense boundaries with club-branded placeholders. Content should appear to load progressively, not all-at-once after a spinner.

**Phase:** Polish (Phase 4-5)

---

### 4. Generic Carousel Copy
**Risk:** MEDIUM
**Current evidence:** Hero carousel uses motivational text like "Unleash the Passion" and "Feel the roar" — reads as template/stock copy, not real club content.

**Warning signs:** Text that could apply to any team, not specifically Zinme United.

**Prevention:** Replace with real club-specific content — actual match photos, real announcements, genuine club messaging. If the club doesn't have this content, use real data (next match, latest result) instead of generic inspirational text.

**Phase:** Home Page (Phase 3)

---

### 5. Icon-Based Navigation
**Risk:** MEDIUM
**Current evidence:** Navigation uses icons alongside generic labels, which is contrary to football club website convention. Real club sites use text-only nav: "Home", "Squad", "Fixtures", "News", "Gallery", "About".

**Warning signs:** Users looking for "Fixtures" find an icon they don't associate with match schedules.

**Prevention:** Switch to text-based navigation labels using football-specific terminology. Icons can accent but should not replace text labels.

**Phase:** Layout Shell (Phase 2)

---

### 6. Minimal/Broken Footer
**Risk:** MEDIUM
**Current evidence:** Footer has 3 placeholder `href="#"` links and a hardcoded 2025 copyright year.

**Warning signs:** Clicking footer links does nothing. Footer looks like an afterthought.

**Prevention:** Build a proper club footer with: nav links, social media icons, contact info, sponsor logos, dynamic copyright year.

**Phase:** Layout Shell (Phase 2)

---

### 7. System Fonts
**Risk:** MEDIUM
**Current evidence:** No custom fonts loaded — site uses browser defaults.

**Warning signs:** Headlines look "boring" or "generic" regardless of layout quality.

**Prevention:** Add a bold/condensed heading font (Montserrat, Oswald, or Bebas Neue) and a clean body font. Typography is the single highest-impact design change for perceived professionalism.

**Phase:** Design System (Phase 1)

---

### 8. Two Date Libraries
**Risk:** LOW
**Current evidence:** Both `date-fns` and `dayjs` are installed. Inconsistent date formatting across components.

**Warning signs:** Dates displayed differently on different pages (e.g., "Jan 5, 2026" vs "05/01/2026").

**Prevention:** Pick one (date-fns is tree-shakable, prefer it), remove the other, create a shared date format utility.

**Phase:** Design System (Phase 1) or cleanup pass

---

### 9. Two Icon Libraries
**Risk:** LOW
**Current evidence:** Both `lucide-react` and `react-icons` are installed.

**Warning signs:** Icons have visually different styles on different parts of the site.

**Prevention:** Consolidate to `lucide-react` for consistent icon aesthetic.

**Phase:** Design System (Phase 1) or cleanup pass

---

### 10. Empty State Gaps
**Risk:** MEDIUM
**Current evidence:** If fixtures, news, or gallery data is empty, pages may show blank content or broken layouts.

**Warning signs:** New visitors see empty pages that look broken.

**Prevention:** Design branded empty states ("No upcoming fixtures" with club imagery) for every data-dependent section.

**Phase:** Polish (Phase 4-5)

---

### 11. Image Quality Dependency
**Risk:** HIGH (external)
**Current evidence:** The redesign will prominently feature team/player photos. If these are low quality, the entire "professional" goal is undermined.

**Warning signs:** Pixelated hero images, inconsistent player photo sizes/backgrounds.

**Prevention:** This is outside code scope but critical. Ensure the club has high-quality photos before the hero section and player cards are finalized. Use Cloudinary transforms to ensure consistent sizing.

**Phase:** Awareness throughout, especially Phase 3 (Home) and Phase 4 (Squad)

---

### 12. Mobile Navigation Afterthought
**Risk:** MEDIUM
**Current evidence:** Many football fans browse on mobile. If the mobile nav is a basic hamburger with no polish, the professional feel breaks on phones.

**Warning signs:** Hamburger menu opens with no transition, links are small touch targets, no club branding in mobile menu.

**Prevention:** Design mobile nav as a first-class experience — slide-out menu with club colors, proper touch targets, smooth transitions.

**Phase:** Layout Shell (Phase 2)

---

### 13. Scope Creep into Backend
**Risk:** MEDIUM
**Current evidence:** The temptation to "fix" backend issues while redesigning the frontend.

**Warning signs:** Creating new API endpoints, modifying data models, adding new database fields.

**Prevention:** This is a frontend redesign only. All data already exists. If data structure is inconvenient, transform it in the frontend hooks/components, not by changing the API.

**Phase:** Awareness throughout all phases

## Phase Mapping Summary

| Phase | Pitfalls Addressed |
|-------|-------------------|
| Design System (1) | #2 (colors), #7 (fonts), #8 (dates), #9 (icons), #1 (consistency foundation) |
| Layout Shell (2) | #5 (nav), #6 (footer), #12 (mobile nav), #1 (shared layouts) |
| Home Page (3) | #4 (generic copy), #11 (image quality) |
| Inner Pages (4) | #10 (empty states), #11 (image quality) |
| Polish (5) | #3 (loading states), #10 (empty states), responsive refinement |

---
*Pitfalls research: 2026-05-01*
