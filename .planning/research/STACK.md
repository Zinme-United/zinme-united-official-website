# Stack Research: Football Club Website Redesign

**Project:** Zinme United Official Website Redesign
**Mode:** Ecosystem (Stack dimension)
**Confidence:** HIGH

## Current Stack (Keep)

The existing stack is solid for this redesign. No framework migration needed.

| Technology | Version | Role | Keep? |
|-----------|---------|------|-------|
| React | 19.1.0 | UI framework | Yes |
| Vite | 6.3.5 | Build tool | Yes |
| TypeScript | ~5.8.3 | Type safety | Yes |
| Tailwind CSS | 4.1.5 | Styling | Yes |
| React Router | 7.5.3 | Routing | Yes |
| React Query | 5.77.0 | Server state | Yes |
| Redux Toolkit | 2.8.2 | Auth state | Yes |
| Axios | 1.9.0 | HTTP client | Yes |
| Swiper | 11.2.10 | Carousel/slider | Yes |
| Lucide React | 0.508.0 | Icons | Yes |

## Additions (Recommended)

### UI & Animation

| Library | Purpose | Rationale | Confidence |
|---------|---------|-----------|------------|
| **Framer Motion** (latest) | Page transitions, scroll animations, hover effects | Industry standard for React animations. Football club sites rely on smooth hero transitions, card hover effects, and scroll-triggered section reveals. Swiper handles carousels but Framer Motion handles everything else. | HIGH |
| **@fontsource/montserrat** or similar sports font | Typography | System fonts scream "amateur." Professional club sites use bold, condensed headline fonts. Montserrat or Inter for body, with a bolder option like Oswald or Bebas Neue for headings. | HIGH |
| **clsx** or **tailwind-merge** | Conditional class names | Clean up className string concatenation throughout the codebase. Small utility, big readability improvement. | HIGH |

### Design System

| Approach | Purpose | Rationale | Confidence |
|----------|---------|-----------|------------|
| **Tailwind CSS theme extension** | Unified color palette, spacing, typography | Currently has 5-6 hardcoded hex blues scattered across components. Must consolidate into Tailwind config custom colors (e.g., `club-primary`, `club-secondary`, `club-accent`). | HIGH |
| **CSS custom properties** for brand tokens | Dynamic theming | Define brand colors as CSS variables consumed by Tailwind. Single source of truth for the club's color identity. | HIGH |

## What NOT to Use

| Library | Why Not |
|---------|---------|
| **Next.js** | Migration from Vite SPA would be massive scope creep. Current SPA architecture is fine for a club website. |
| **Chakra UI / MUI** | Would conflict with Tailwind approach. The site already uses Tailwind effectively. Adding a component library creates two styling systems. |
| **Three.js / heavy 3D** | Overkill for an amateur club site. Would slow load times and add complexity for minimal benefit. |
| **GSAP** | Framer Motion covers all animation needs with better React integration. No need for two animation libraries. |
| **Styled Components** | Tailwind is already established. Mixing paradigms creates maintenance burden. |

## Cleanup (Remove or Consolidate)

| Issue | Action | Rationale |
|-------|--------|-----------|
| `date-fns` + `dayjs` (two date libraries) | Pick one, remove the other | Unnecessary bundle bloat. `date-fns` is tree-shakable, prefer it. |
| `react-icons` + `lucide-react` (two icon libraries) | Consolidate to `lucide-react` | Consistent icon style across the site. |
| `react-spinners` | Replace with Tailwind CSS animations | Custom loading states that match club branding look more professional than generic spinners. |
| `lottie-react` | Keep only if Lottie animations are actively used | If unused, remove to reduce bundle. |

## Tailwind Config Strategy

```
Extend Tailwind config with:
- Custom colors: club-primary, club-secondary, club-dark, club-light, club-accent
- Custom fonts: heading (bold/condensed), body (clean/readable)
- Custom spacing for consistent section padding
- Custom border-radius tokens
- Animation keyframes for common patterns (fade-in, slide-up, etc.)
```

## Summary

The redesign is purely frontend — no backend changes needed. The existing React + Vite + Tailwind stack is capable. Key additions are Framer Motion for animations, custom fonts for typography, and a proper Tailwind theme configuration for brand consistency. The biggest wins come from consolidating scattered styles into a design system, not from adding new frameworks.

---
*Stack research: 2026-05-01*
