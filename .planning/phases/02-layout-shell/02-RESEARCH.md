# Phase 2: Layout Shell - Research

**Researched:** 2026-05-04
**Domain:** React layout components, responsive navigation, CSS transitions
**Confidence:** HIGH

## Summary

Phase 2 replaces the existing basic Navbar, Footer, and PublicLayout with premium football-club-grade layout components. The current codebase already has these components but in a minimal state: the Navbar is a simple solid-bg bar with icon+text links, the Footer is a single centered paragraph with social icons, and there is no shared PageHero component (only a home-page HeroSection with Swiper). The existing route structure in `App.tsx` with `PublicLayout` using `<Outlet />` is the correct pattern and should be preserved.

The project already has all needed libraries installed: Tailwind CSS v4 with semantic tokens in `index.css`, `lucide-react` for icons, `react-router` v7 for routing, and `@headlessui/react` v2 for accessible transitions/dialogs. Framer Motion is NOT installed and should NOT be added for this phase -- CSS transitions and Headless UI's built-in Transition component handle all needed animations (scroll-based navbar transparency, mobile menu open/close). Framer Motion will be needed later for Phase 3/4 scroll animations.

**Primary recommendation:** Rebuild Navbar, Footer, and PublicLayout in-place; create new PageHero component; use existing design tokens and @headlessui/react for transitions. No new dependencies needed.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Sticky navbar with backdrop blur effect on scroll -- starts transparent over hero, transitions to solid/blurred on scroll
- Contains: club crest + club name text + nav links (Home, Squad, Fixtures, News, Gallery, About) -- nothing else
- Active page link highlighted with gold (accent color) underline
- White text on transparent state, adjusts for readability on solid state
- Full-screen overlay mobile menu (NOT drawer or dropdown) with solid primary (dark blue) background, white/gold text
- Mobile menu content: club crest at top, large tap-friendly nav links in center, social media icons at bottom
- Hamburger icon on the right side of navbar
- Smooth open/close animation for mobile menu
- Footer 3-column layout: navigation links | contact info (address, email) | social media icons
- Dark primary blue background with white text for footer
- Club crest displayed centered above the footer columns
- Copyright line with dynamic current year at bottom
- No newsletter signup or email capture
- PageHero: ~40vh height on inner pages, dark gradient overlay, page title with breadcrumbs, fixed background positioning for parallax, Oswald uppercase title
- Navbar should feel like top-tier football club sites (Man City, Arsenal)
- Mobile menu should feel premium -- full-screen takeover

### Claude's Discretion
- Exact animation timing and easing curves for navbar transition and mobile menu
- Responsive breakpoint behavior (when to switch from desktop nav to hamburger)
- Footer column stacking behavior on mobile
- Hero image fallback when no background image is provided

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| NAVL-01 | Navbar displays club crest and text-based navigation links (Home, Squad, Fixtures, News, Gallery, About) | Existing Navbar component to rebuild; routeLinks constant needs updating to match new nav labels; club crest at `/ZMUTD Official.png` |
| NAVL-02 | Navbar is sticky/fixed and stays visible on scroll | Use `fixed top-0` positioning with scroll-aware state via `useEffect` + `window.scrollY`; backdrop-filter blur on scroll |
| NAVL-03 | Footer includes navigation links, social media icons, contact info, and dynamic copyright year | Existing Footer component to rebuild into 3-column grid; use `new Date().getFullYear()` for dynamic year |
| NAVL-04 | Every page uses a shared PageHero component with title and background | New component; NOT the existing HeroSection (that's a home-page Swiper carousel, different purpose) |
| NAVL-05 | Mobile navigation is a polished slide-out menu with club branding and smooth transitions | Use @headlessui/react Dialog for accessible full-screen overlay with Transition for animations |
| NAVL-06 | All pages are fully responsive across mobile, tablet, and desktop | Tailwind responsive utilities; test at sm/md/lg breakpoints |
</phase_requirements>

## Standard Stack

### Core (Already Installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| tailwindcss | ^4.1.5 | Styling with semantic tokens | Already configured in index.css with club colors |
| @headlessui/react | ^2.2.7 | Accessible Dialog/Transition for mobile menu | Already installed, not yet used; perfect for overlay menu |
| lucide-react | ^0.508.0 | Icons (Menu, X, social icons) | Already used throughout project |
| react-router | ^7.5.3 | Routing, Link, useLocation | Already provides PublicLayout/Outlet pattern |

### No New Dependencies Needed
This phase requires ZERO new npm installs. Everything is already available:
- Scroll detection: native `window.addEventListener('scroll', ...)`
- Animations: CSS transitions + @headlessui/react Transition
- Backdrop blur: Tailwind's `backdrop-blur-md` class
- Fixed positioning: Tailwind's `fixed` class
- Responsive: Tailwind breakpoints (`sm:`, `md:`, `lg:`)

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @headlessui/react Dialog | Custom div with state | Headless UI handles focus trap, escape key, aria attributes -- don't hand-roll accessibility |
| CSS transitions | Framer Motion | Framer Motion is overkill for this phase; save for Phase 3/4 scroll animations |
| scroll event listener | Intersection Observer | Scroll listener is simpler for "scrolled past threshold" boolean state |

## Architecture Patterns

### Recommended Project Structure
```
client/src/
├── components/
│   ├── layout/              # NEW: layout-specific components
│   │   ├── Navbar.tsx        # Rebuilt navbar with scroll awareness
│   │   ├── MobileMenu.tsx    # Full-screen overlay menu (extracted)
│   │   ├── Footer.tsx        # Rebuilt 3-column footer
│   │   └── PageHero.tsx      # NEW: shared inner-page hero
│   ├── Navbar.tsx            # REPLACE with layout/Navbar.tsx (or update in-place)
│   ├── Footer.tsx            # REPLACE with layout/Footer.tsx (or update in-place)
│   └── index.ts             # Update exports
├── constants/
│   └── index.ts             # Update routeLinks for new nav structure
└── App.tsx                  # Update PublicLayout wrapper
```

**Decision for planner:** Either create a `layout/` subfolder or update files in-place. Given there are only 4 layout components, updating in-place in `components/` is simpler and avoids import churn. The MobileMenu can be extracted as a separate component since it has substantial logic.

### Pattern 1: Scroll-Aware Navbar
**What:** Navbar starts transparent, transitions to solid bg with backdrop blur after scrolling past a threshold.
**When to use:** On all public pages via PublicLayout.
**Example:**
```typescript
// Custom hook for scroll detection
const useScrolled = (threshold = 50) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);
  return scrolled;
};

// In Navbar:
const scrolled = useScrolled();
// Classes toggle between transparent and solid states:
// transparent: "bg-transparent"
// scrolled: "bg-primary/95 backdrop-blur-md shadow-lg"
```

### Pattern 2: Full-Screen Mobile Menu with Headless UI
**What:** Accessible overlay using Dialog + Transition from @headlessui/react v2.
**When to use:** Mobile navigation on screens < md breakpoint.
**Example:**
```typescript
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';

<Transition show={isOpen}>
  <Dialog onClose={setIsOpen} className="relative z-50">
    <TransitionChild
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed inset-0 bg-primary" />
    </TransitionChild>
    <TransitionChild
      enter="transition-transform duration-300 ease-out"
      enterFrom="translate-y-[-100%]"
      enterTo="translate-y-0"
      leave="transition-transform duration-200 ease-in"
      leaveFrom="translate-y-0"
      leaveTo="translate-y-[-100%]"
    >
      <DialogPanel className="fixed inset-0 flex flex-col items-center justify-center">
        {/* Menu content */}
      </DialogPanel>
    </TransitionChild>
  </Dialog>
</Transition>
```

### Pattern 3: PageHero with Breadcrumbs
**What:** Reusable hero banner for inner pages with title, breadcrumbs, and background image.
**When to use:** Every page except home (home uses its own HeroSection with Swiper).
**Example:**
```typescript
interface PageHeroProps {
  title: string;
  backgroundImage?: string;
  breadcrumbs?: { label: string; path?: string }[];
}

const PageHero = ({ title, backgroundImage, breadcrumbs }: PageHeroProps) => (
  <section
    className="relative h-[40vh] bg-cover bg-center bg-fixed"
    style={{ backgroundImage: backgroundImage ? `url('${backgroundImage}')` : undefined }}
  >
    <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/90 via-black/40 to-transparent" />
    <div className="relative z-10 h-full flex flex-col items-center justify-center text-white">
      <h1 className="text-4xl md:text-5xl font-heading uppercase tracking-wide">{title}</h1>
      {breadcrumbs && (
        <nav className="mt-3 text-sm text-white/70">
          {breadcrumbs.map((crumb, i) => (
            <span key={i}>
              {i > 0 && <span className="mx-2">&gt;</span>}
              {crumb.path ? <Link to={crumb.path} className="hover:text-accent">{crumb.label}</Link> : crumb.label}
            </span>
          ))}
        </nav>
      )}
    </div>
  </section>
);
```

### Pattern 4: PublicLayout with Fixed Navbar Offset
**What:** When navbar is `fixed`, page content needs top padding to prevent overlap.
**When to use:** PublicLayout wrapper in App.tsx.
**Example:**
```typescript
const PublicLayout = () => (
  <div className="min-h-screen flex flex-col bg-surface">
    <Navbar />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);
// Note: No pt-16 needed because PageHero/HeroSection sit behind the transparent navbar.
// The content naturally flows under the fixed navbar which is transparent initially.
```

### Anti-Patterns to Avoid
- **Putting scroll listener without cleanup:** Always return cleanup function from useEffect
- **Using `position: sticky` instead of `fixed`:** Sticky won't achieve transparent-over-hero because it doesn't overlap content; use `fixed` with `z-50`
- **Hardcoding hex colors:** Use semantic tokens from index.css (`bg-primary`, `text-accent`, etc.)
- **Building custom focus trap for mobile menu:** Use @headlessui/react Dialog which handles this automatically
- **Adding `pt-16` or `pt-20` to body/main:** The transparent navbar overlapping the hero is the desired effect; only non-hero content below needs spacing awareness, but each page's PageHero handles this naturally

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Mobile menu accessibility | Custom focus trap, aria attributes, escape handling | @headlessui/react Dialog | Focus management, screen reader support, escape key, click-outside -- all handled |
| Mobile menu transitions | Manual CSS class toggling with timeouts | @headlessui/react Transition | Handles enter/leave states, unmounting after animation, no race conditions |
| Icon rendering | Custom SVG icons | lucide-react | Already used throughout, consistent sizing and styling |
| Responsive breakpoints | Custom media queries | Tailwind `md:` prefix | Consistent with existing codebase, `md:` at 768px is the standard mobile breakpoint |
| Copyright year | Hardcoded "2025" (current bug!) | `new Date().getFullYear()` | Current Footer hardcodes 2025 -- must be dynamic |

**Key insight:** The existing Footer hardcodes "2025" -- this is exactly the kind of bug this phase fixes.

## Common Pitfalls

### Pitfall 1: Navbar Flash on Page Load
**What goes wrong:** Navbar loads as "scrolled" style briefly before JS hydrates and detects scroll position is 0.
**Why it happens:** Initial state might default to `scrolled = true`, or there's a render before the scroll listener attaches.
**How to avoid:** Default `scrolled` state to `false` (transparent). The listener fires immediately if user is mid-page on refresh.
**Warning signs:** Visible color flash on page load.

### Pitfall 2: Mobile Menu Not Closing on Navigation
**What goes wrong:** User taps a link in mobile menu, page navigates but menu stays open.
**Why it happens:** react-router navigation doesn't automatically close the Dialog.
**How to avoid:** Close the menu `onClick` on each nav link, or use `useLocation` to detect route changes and close.
**Warning signs:** Menu overlay persists after clicking a link.

### Pitfall 3: Fixed Navbar Z-Index Conflicts
**What goes wrong:** Navbar appears behind modals, toasts, or other overlays.
**Why it happens:** Z-index stacking without a plan.
**How to avoid:** Use consistent z-index scale: `z-40` for navbar, `z-50` for mobile menu/Dialog, existing toast container handles its own z-index.
**Warning signs:** Visual overlap issues with other UI elements.

### Pitfall 4: Background-attachment: fixed Not Working on iOS
**What goes wrong:** The `bg-fixed` (background-attachment: fixed) parallax effect on PageHero doesn't work on iOS Safari.
**Why it happens:** iOS Safari does not support `background-attachment: fixed` on most elements.
**How to avoid:** Accept this gracefully -- on iOS it will simply scroll normally. This is standard practice even on major club sites. Alternatively, use a separate fixed-position div behind the content with `will-change: transform`.
**Warning signs:** No parallax effect on mobile Safari.

### Pitfall 5: Route Links Mismatch
**What goes wrong:** The nav shows links like "Squad" and "Fixtures" but routes still point to old paths ("/players", "/activities").
**Why it happens:** The CONTEXT.md specifies new nav labels (Squad, Fixtures, News, Gallery, About) but existing routes use different names.
**How to avoid:** This phase updates the `routeLinks` constant to new labels. Route PATHS stay the same for now (changing paths is a larger refactor). Map: "Squad" -> `/players`, "Fixtures" -> `/activities`, "News" -> `/articles`, "Gallery" -> `/gallery-details` or a new gallery index route, "About" -> `/our-club`.
**Warning signs:** 404s when clicking nav links.

## Code Examples

### Scroll-Aware Navbar with Transition
```typescript
const Navbar = () => {
  const scrolled = useScrolled(50);
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      scrolled
        ? 'bg-primary/95 backdrop-blur-md shadow-lg'
        : 'bg-transparent'
    }`}>
      <div className="max-w-[var(--container-content)] mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/ZMUTD Official.png" alt="Zinme United" className="h-10 w-auto" />
            <span className="font-heading text-xl text-white uppercase tracking-wide">
              Zinme United
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.route}
                to={link.route}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(link.route, location.pathname)
                    ? 'text-accent border-b-2 border-accent'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Hamburger - right side */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden text-white p-2"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </nav>
  );
};
```

### 3-Column Footer
```typescript
const Footer = () => (
  <footer className="bg-primary text-white mt-auto">
    {/* Club crest centered */}
    <div className="flex justify-center pt-10 pb-6">
      <img src="/ZMUTD Official.png" alt="Zinme United" className="h-16 w-auto" />
    </div>

    {/* 3-column grid */}
    <div className="max-w-[var(--container-content)] mx-auto px-6 pb-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
      {/* Navigation Links */}
      <div>
        <h3 className="font-heading text-lg uppercase tracking-wide mb-4">Quick Links</h3>
        <ul className="space-y-2 text-white/70">
          {navLinks.map(link => (
            <li key={link.route}>
              <Link to={link.route} className="hover:text-accent transition-colors">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Contact Info */}
      <div>
        <h3 className="font-heading text-lg uppercase tracking-wide mb-4">Contact</h3>
        <div className="space-y-2 text-white/70">
          <p>Zinme United Football Club</p>
          <p>email@zinmeunited.com</p>
        </div>
      </div>

      {/* Social Icons */}
      <div>
        <h3 className="font-heading text-lg uppercase tracking-wide mb-4">Follow Us</h3>
        <div className="flex gap-4 justify-center md:justify-start">
          <a href="https://www.facebook.com/zmutdfc" target="_blank" rel="noopener noreferrer"
             className="text-white/70 hover:text-accent transition-colors">
            <Facebook size={22} />
          </a>
          {/* More social icons */}
        </div>
      </div>
    </div>

    {/* Copyright */}
    <div className="border-t border-white/10 py-4 text-center text-white/50 text-sm">
      &copy; {new Date().getFullYear()} Zinme United FC. All rights reserved.
    </div>
  </footer>
);
```

## State of the Art

| Old Approach (Current) | Current Approach (Target) | Impact |
|------------------------|---------------------------|--------|
| Solid bg navbar (`bg-primary`) | Transparent-to-blur fixed navbar | Premium feel, hero image visible through navbar |
| Simple show/hide mobile dropdown | Full-screen overlay with @headlessui Dialog | Accessibility, premium feel, proper focus management |
| Single-line centered footer | 3-column informational footer | Professional appearance, better information architecture |
| No PageHero component | Shared PageHero with gradient, breadcrumbs, parallax | Consistent inner page branding |
| Hardcoded copyright year (2025) | Dynamic `new Date().getFullYear()` | Always current |
| Icon-based nav links | Text-only nav links (no icons) | Cleaner, matches premium club aesthetic |

## Discretion Recommendations

### Animation Timing
- **Navbar scroll transition:** `duration-300` with default ease -- fast enough to feel responsive, smooth enough to not be jarring
- **Mobile menu open:** `duration-300 ease-out` -- standard dialog entrance
- **Mobile menu close:** `duration-200 ease-in` -- slightly faster close feels snappier

### Responsive Breakpoint
- **Desktop-to-hamburger switch:** `md:` breakpoint (768px) -- this is the Tailwind default and matches the existing codebase pattern (`sm:hidden` is currently used at 640px, but 768px gives more room for 6 nav links)
- Rationale: 6 text links + logo need ~700px minimum to display comfortably

### Footer Mobile Stacking
- Single column stack on mobile (`grid-cols-1`), 3 columns on `md:` and up
- Center-align text on mobile, left-align on desktop

### Hero Image Fallback
- When no `backgroundImage` prop is provided, use a solid `bg-primary-dark` background
- This ensures the gradient overlay and text still look good without an image

## Open Questions

1. **Gallery route path**
   - What we know: Current routes have `/gallery-details/:id` but no gallery index page
   - What's unclear: Should nav link "Gallery" point to a page that doesn't exist yet?
   - Recommendation: Point to `/gallery-details` or a new `/gallery` path; the actual page will be built in Phase 4. For now, the link can exist but route to a placeholder or 404 gracefully.

2. **Nav link labels vs. route paths**
   - What we know: CONTEXT specifies "Squad, Fixtures, News, Gallery, About" but routes are "/players", "/activities", "/articles", "/gallery-details", "/our-club"
   - What's unclear: Should route paths be renamed to match labels?
   - Recommendation: Keep existing route paths for now (renaming routes is scope creep). Update only the display labels in `routeLinks`.

3. **Admin link in navbar**
   - What we know: Current Navbar shows "Admin Panel" link for admin users
   - What's unclear: Should this be preserved in the redesigned navbar?
   - Recommendation: Preserve it but only show when logged in as admin (existing behavior). It's not in the CONTEXT decisions but removing it would break admin access.

## Sources

### Primary (HIGH confidence)
- Existing codebase analysis: `App.tsx`, `Navbar.tsx`, `Footer.tsx`, `HeroSection.tsx`, `index.css`, `constants/index.ts`
- Tailwind CSS v4 `@theme` configuration already in `index.css`
- @headlessui/react v2 installed in `package.json`

### Secondary (MEDIUM confidence)
- @headlessui/react Dialog/Transition API patterns -- based on well-established v2 API
- Tailwind `backdrop-blur-md` and `bg-fixed` utility classes -- standard Tailwind utilities
- iOS `background-attachment: fixed` limitation -- widely documented browser behavior

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - all libraries already installed, no new dependencies
- Architecture: HIGH - clear patterns from existing codebase, straightforward layout component rebuilds
- Pitfalls: HIGH - well-known issues (iOS bg-fixed, focus trap, z-index) with established solutions

**Research date:** 2026-05-04
**Valid until:** 2026-06-04 (stable -- no fast-moving dependencies)
