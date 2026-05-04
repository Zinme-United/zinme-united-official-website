# Features Research: Football Club Website Redesign

**Project:** Zinme United Official Website Redesign
**Mode:** Ecosystem (Features dimension)
**Confidence:** MEDIUM-HIGH

## Table Stakes (Must Have)

These are expected on any football club website. Missing any of these makes the site feel incomplete.

### Navigation & Branding
| Feature | Complexity | Description |
|---------|-----------|-------------|
| Club crest in header | Low | Logo prominently displayed in navigation bar |
| Text-based navigation | Low | "Home", "Squad", "Fixtures", "News", "Gallery", "About" — standard football nav labels |
| Sticky/fixed header | Low | Navigation stays visible on scroll |
| Club-branded footer | Medium | Social links, contact info, sponsors, copyright |
| Consistent color scheme | Medium | Club colors applied consistently across all pages |
| Professional typography | Medium | Sports-editorial headline font + clean body font |

### Home Page
| Feature | Complexity | Description |
|---------|-----------|-------------|
| Hero section with team imagery | Medium | Large hero with club crest, team photo or action shot, tagline |
| Next match / upcoming fixture | Medium | Prominent display of the next upcoming match with opponent and date |
| Latest results | Medium | Recent match scores displayed as cards |
| Latest news preview | Medium | 2-3 recent news articles with thumbnails |
| Squad spotlight | Low | Featured player(s) or "meet the team" teaser |

### Squad Page
| Feature | Complexity | Description |
|---------|-----------|-------------|
| Player cards with photos | Medium | Name, position, number, photo per player |
| Grouped by position | Low | Goalkeepers, Defenders, Midfielders, Forwards sections |
| Player detail/profile | Medium | Individual player page with stats and bio |

### Fixtures & Results
| Feature | Complexity | Description |
|---------|-----------|-------------|
| Upcoming fixtures list | Medium | Date, opponent, venue for future matches |
| Past results | Medium | Score, opponent, date for completed matches |
| Match cards with team logos | Medium | Visual cards showing both team crests and score |

### News
| Feature | Complexity | Description |
|---------|-----------|-------------|
| News listing page | Medium | Cards with thumbnail, title, date, excerpt |
| Individual article page | Medium | Full article with images |
| Featured/pinned articles | Low | Highlight important news at the top |

### About / Club Page
| Feature | Complexity | Description |
|---------|-----------|-------------|
| Club history/story | Low | Narrative about the club's founding and journey |
| Mission and values | Low | What the club stands for |
| Coaching staff | Medium | Staff profiles similar to player cards |

### Gallery
| Feature | Complexity | Description |
|---------|-----------|-------------|
| Photo gallery grid | Medium | Categorized photo albums |
| Lightbox image viewer | Medium | Click to enlarge photos |

## Differentiators (Nice to Have)

These separate a polished amateur site from a basic one. Achievable with existing data.

| Feature | Complexity | Description | Dependencies |
|---------|-----------|-------------|--------------|
| Match countdown timer | Low | Live countdown to next fixture on home page | Fixtures data |
| Animated page transitions | Medium | Smooth transitions between pages | Framer Motion |
| Scroll-triggered section reveals | Medium | Sections animate in as user scrolls | Framer Motion |
| Interactive squad formation view | High | Pitch visualization showing player positions | Player position data |
| Player stats display | Medium | Goals, assists, appearances on player profiles | Stats data (if exists) |
| Partners/sponsors banner | Low | Logo carousel of club sponsors | Sponsor logos |
| Social media feed integration | Medium | Embedded social posts on home page | Social media accounts |
| Match day gallery | Medium | Photo albums linked to specific fixtures | Gallery + Fixtures data |

## Anti-Features (Do NOT Build)

| Feature | Reason |
|---------|--------|
| E-commerce / merchandise shop | Explicitly out of scope — high complexity, not core to club identity |
| Member login / fan accounts | Out of scope — adds auth complexity for public users |
| Live match updates / scores | Beyond amateur team capability to maintain in real-time |
| Forum / comments | Moderation burden inappropriate for amateur club |
| Video streaming | Storage/bandwidth costs too high |
| Push notifications | Overkill for amateur site traffic |
| Ticket purchasing | Amateur teams don't typically sell tickets online |
| Multi-language support | Not requested, adds significant complexity |

## Dependencies Between Features

```
Design System (colors, fonts, spacing)
  └── Navigation & Footer (appears on every page)
       └── Home Page sections
       └── Squad Page
       └── Fixtures & Results Page
       └── News Page
       └── Gallery Page
       └── About Page
```

Every page depends on the design system and navigation frame being built first.

## Existing Data Available

Based on codebase analysis, these data models already exist:
- **Players**: name, position, number, image, stats, social links, bio
- **Activities**: can represent matches (with opponent logos, scores) and events
- **News**: title, content, images, tags, featured flag
- **Gallery**: images with categories
- **Our Club**: club information, history, mission
- **Coaches**: name, role, image, bio

**Key insight:** The "Activities" model needs to be visually split — matches should appear in a dedicated Fixtures & Results view, while training/events stay separate.

## MVP Phasing Suggestion

1. **Design system + navigation frame** (foundation for everything)
2. **Home page redesign** (highest visibility impact)
3. **Inner pages** (Squad, Fixtures, News, Gallery, About)
4. **Polish & animations** (transitions, scroll effects, responsive refinement)

---
*Features research: 2026-05-01*
