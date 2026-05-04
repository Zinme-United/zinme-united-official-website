---
phase: 02-layout-shell
verified: 2026-05-04T07:00:00Z
status: gaps_found
score: 12/14 must-haves verified
re_verification: false
gaps:
  - truth: "Navbar displays club crest and text-only navigation links (Home, Squad, Fixtures, News, Gallery, About) without icons"
    status: partial
    reason: "Gallery link is commented out in navLinks constant -- only 5 of 6 links are active"
    artifacts:
      - path: "client/src/constants/index.ts"
        issue: "Line 11: Gallery entry is commented out -- { label: 'Gallery', route: '/gallery' }"
    missing:
      - "Uncomment Gallery navLink entry in client/src/constants/index.ts"
      - "Add /gallery route to App.tsx router (even if it shows a placeholder page) so the link resolves"
  - truth: "Every inner page renders with a PageHero showing page title and breadcrumbs"
    status: partial
    reason: "Gallery page route does not exist in App.tsx -- no /gallery route defined, only /gallery-details/:id"
    artifacts:
      - path: "client/src/App.tsx"
        issue: "No /gallery route in the router -- Gallery nav link would lead to 404"
    missing:
      - "Add /gallery route to router in App.tsx (can point to a minimal page or redirect)"
---

# Phase 2: Layout Shell Verification Report

**Phase Goal:** Visitors see professional football club navigation and layout on every page, with seamless mobile experience
**Verified:** 2026-05-04T07:00:00Z
**Status:** gaps_found
**Re-verification:** No -- initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Navbar displays club crest and text-only navigation links (Home, Squad, Fixtures, News, Gallery, About) without icons | PARTIAL | Club crest present; text-only links verified; but Gallery link is commented out in navLinks -- only 5 of 6 links rendered |
| 2 | Navbar starts transparent over hero content and transitions to solid dark blue with backdrop blur on scroll | VERIFIED | `useScrolled` hook at 50px threshold; `bg-transparent` to `bg-primary/95 backdrop-blur-md shadow-lg` transition in Navbar.tsx |
| 3 | Active page link is highlighted with gold (accent) underline | VERIFIED | `text-accent border-b-2 border-accent` applied via `isActivePath` matching in both Navbar and MobileMenu |
| 4 | Hamburger icon appears on right side below md breakpoint and opens full-screen overlay mobile menu | VERIFIED | `md:hidden` hamburger button with `Menu` icon; onClick sets `mobileOpen` state; renders `<MobileMenu>` |
| 5 | Mobile menu shows club crest at top, large tap-friendly nav links in center, social media icons at bottom | VERIFIED | MobileMenu.tsx: crest (h-20), text-2xl nav links in flex-col, Facebook icon at bottom |
| 6 | Mobile menu closes when a nav link is tapped | VERIFIED | Each Link has `onClick={() => onClose(false)}` in MobileMenu.tsx line 76 |
| 7 | Footer displays 3-column layout with navigation links, contact info, and social media icons | VERIFIED | Footer.tsx: grid-cols-1 md:grid-cols-3 with Quick Links, Contact, Follow Us columns |
| 8 | Club crest is centered above the footer columns | VERIFIED | Footer.tsx: `flex justify-center pt-10 pb-6` wrapping crest image |
| 9 | Copyright line shows dynamic current year (not hardcoded 2025) | VERIFIED | Footer.tsx line 74: `{new Date().getFullYear()}` |
| 10 | No newsletter signup or email capture in footer | VERIFIED | Grep for newsletter/subscribe/email capture returned no matches in Footer.tsx |
| 11 | Every inner page renders with a PageHero showing page title and breadcrumbs | PARTIAL | PageHero wired into 6 pages (ClubPage, Activities, Players, ArticlesPage, PlayerDetails, ArticlesDetails) with proper titles and breadcrumbs. But no /gallery route exists in the router. |
| 12 | PageHero has dark gradient overlay and ~40vh height | VERIFIED | PageHero.tsx: `h-[40vh] min-h-[280px]` with `bg-gradient-to-t from-primary-dark/90 via-black/40 to-transparent` |
| 13 | PublicLayout wraps all public routes with Navbar + main content + Footer | VERIFIED | App.tsx: PublicLayout renders Navbar + main(Outlet) + Footer; all public routes are children |
| 14 | Home page does NOT use PageHero (uses its own HeroSection) | VERIFIED | Home.tsx imports `HeroSection` from components, no PageHero import |

**Score:** 12/14 truths verified (2 partial)

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `client/src/constants/index.ts` | NavLink interface and navLinks array with 6 entries | PARTIAL | NavLink interface correct; only 5 entries active -- Gallery commented out on line 11 |
| `client/src/components/Navbar.tsx` | Scroll-aware fixed navbar with transparent-to-blur transition | VERIFIED | 100 lines; useScrolled hook, isActivePath, transparent/blur transition, admin link preserved |
| `client/src/components/MobileMenu.tsx` | Full-screen overlay menu using @headlessui/react Dialog | VERIFIED | 120 lines; Dialog/Transition from @headlessui/react, slide-down animation, club branding |
| `client/src/components/Footer.tsx` | 3-column footer with nav links, contact info, social icons, dynamic year | VERIFIED | 80 lines; 3-column grid, navLinks iteration, dynamic getFullYear(), Facebook social icon |
| `client/src/components/PageHero.tsx` | Shared inner-page hero with title, breadcrumbs, gradient overlay | VERIFIED | 56 lines; 40vh height, gradient overlay, optional breadcrumbs with Link, bg-fixed parallax |
| `client/src/App.tsx` | PublicLayout with full-width rendering | VERIFIED | No container constraint; bg-surface; semantic main element; Navbar + Footer wired |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| Navbar.tsx | constants/index.ts | `import navLinks` | WIRED | Line 2: `import { navLinks } from "../constants"` |
| Navbar.tsx | MobileMenu.tsx | `<MobileMenu>` render | WIRED | Line 95: `<MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />` |
| MobileMenu.tsx | @headlessui/react | Dialog and Transition import | WIRED | Line 1-6: imports Dialog, DialogPanel, Transition, TransitionChild |
| Footer.tsx | constants/index.ts | `import navLinks` | WIRED | Line 3: `import { navLinks } from "../constants"` |
| PageHero.tsx | react-router | Link for breadcrumbs | WIRED | Line 1: `import { Link } from "react-router"` |
| App.tsx | Navbar.tsx | PublicLayout renders Navbar | WIRED | Line 31: `<Navbar />` via barrel import |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| NAVL-01 | 02-01 | Navbar displays club crest and text-based navigation links (Home, Squad, Fixtures, News, Gallery, About) | PARTIAL | Crest and 5 text links verified; Gallery link commented out |
| NAVL-02 | 02-01 | Navbar is sticky/fixed and stays visible on scroll | SATISFIED | `fixed top-0 left-0 right-0 z-40` in Navbar.tsx |
| NAVL-03 | 02-02 | Footer includes navigation links, social media icons, contact info, and dynamic copyright year | SATISFIED | 3-column footer with all elements; `new Date().getFullYear()` |
| NAVL-04 | 02-02 | Every page uses a shared PageHero component with title and background | PARTIAL | 6 inner pages use PageHero; no /gallery route exists to apply PageHero to |
| NAVL-05 | 02-01 | Mobile navigation is a polished slide-out menu with club branding and smooth transitions | SATISFIED | Full-screen Dialog overlay with Transition animations, club crest, social icons |
| NAVL-06 | 02-01, 02-02 | All pages are fully responsive across mobile, tablet, and desktop | NEEDS HUMAN | Responsive classes present (md: breakpoints, grid-cols-1 md:grid-cols-3, hidden md:flex); visual testing needed |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `client/src/constants/index.ts` | 11 | Commented-out Gallery nav link | Warning | Gallery is missing from navigation; 5 instead of 6 links |

No TODO, FIXME, PLACEHOLDER, or stub patterns found in the key phase artifacts (Navbar.tsx, MobileMenu.tsx, Footer.tsx, PageHero.tsx).

### Human Verification Required

### 1. Scroll Transition Visual Quality

**Test:** Load any page, scroll down past 50px, scroll back up
**Expected:** Navbar smoothly transitions from transparent to dark blue with blur; reverses cleanly on scroll up
**Why human:** Animation smoothness and visual quality cannot be verified programmatically

### 2. Mobile Menu Full Experience

**Test:** Open site on mobile viewport (< 768px), tap hamburger, navigate links, close menu
**Expected:** Full-screen overlay slides down smoothly; club crest at top; large tap-friendly links; closes on link tap and on X button
**Why human:** Touch interaction, animation timing, and visual polish require device testing

### 3. Responsive Layout Across Breakpoints

**Test:** Resize browser from 320px to 1440px+
**Expected:** Hamburger appears below 768px; footer stacks to single centered column on mobile; nav links comfortably fit on desktop
**Why human:** NAVL-06 requires responsive verification at multiple breakpoints

### 4. PageHero Visual Consistency

**Test:** Visit each inner page (About, Squad, Fixtures, News, player detail, article detail)
**Expected:** Each shows PageHero with ~40vh height, gradient overlay, title in Oswald uppercase, breadcrumbs below
**Why human:** Visual consistency and gradient appearance need visual inspection

### Gaps Summary

Two related gaps were found, both stemming from the Gallery page not yet existing:

1. **Gallery nav link commented out** -- The `navLinks` array in `client/src/constants/index.ts` has the Gallery entry commented out (line 11). This means only 5 of the planned 6 navigation links are visible. This partially fails NAVL-01 which explicitly lists Gallery as one of the required nav labels.

2. **No /gallery route in router** -- `client/src/App.tsx` has no `/gallery` route defined (only `/gallery-details/:id`). The Gallery link was likely commented out because it would resolve to a 404. This is the root cause.

These gaps share a single root cause: the Gallery index page does not exist yet. To close both gaps, a `/gallery` route must be added to the router and the Gallery navLink must be uncommented. The Gallery page itself may be a future phase deliverable, but the nav link and route stub are within this phase's scope per NAVL-01.

---

_Verified: 2026-05-04T07:00:00Z_
_Verifier: Claude (gsd-verifier)_
