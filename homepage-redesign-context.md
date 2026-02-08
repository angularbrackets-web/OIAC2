# Homepage Redesign — Phase 1 Context (Resume File)

## Current Status
**NEXT STEP: Build 3 new proposal pages** (`/proposals/c`, `/proposals/d`, `/proposals/e`) based on revised design direction after user feedback. The original proposals A and B are built and working but the user wants better options.

## Resume Instructions
Read this file first, then build the 3 new proposals described below. The shared infrastructure (ProposalLayout, ProposalNav, ProposalFooter) is already built and reusable. You only need to create new Hero + PrayerTimes components and page files for each new proposal.

---

## What's Already Built (DONE)

### Shared Infrastructure (reuse for all new proposals)
- `src/layouts/ProposalLayout.astro` — standalone layout with Google Fonts, global.css, scroll animations (IntersectionObserver + `.animate-on-scroll`), `noindex/nofollow`, Poppins font
- `src/components/proposals/ProposalNav.astro` — simplified 7-item nav (Home, About, Prayer Times, Programs, Events, New Centre, Contact). Accepts `variant` prop: `"a"` = solid warmWhite bg always, `"b"` = transparent→solid on scroll. Mobile slide-in drawer from right. Lucide icons (Menu, X).
- `src/components/proposals/ProposalFooter.astro` — 4-column footer on bg-deepTeal with Lucide icons. Quick Links, More (Jobs, Staff, Privacy Policy), Contact + social.

### Original Proposals (built but user wants better options)
- `/proposals/a` — gradient hero (deepTeal→terracottaRed) with Islamic pattern, centered text, floating prayer card. **User feedback: decorative but not functional, takes too much space without enough impact.**
- `/proposals/b` — dark gradient hero, left-aligned bold text, horizontal prayer strip with countdown. **User feedback: same concern, looks like tech startup not community centre.**

### Files structure
```
src/components/proposals/
  ProposalFooter.astro     ← DONE, shared
  ProposalNav.astro        ← DONE, shared (variant "a" = solid, "b" = transparent)
  HeroA.astro              ← DONE (original, gradient centered)
  HeroB.astro              ← DONE (original, gradient left-aligned)
  PrayerTimesCardA.astro   ← DONE (floating card, next-prayer highlight)
  PrayerTimesCardB.astro   ← DONE (horizontal strip, countdown timer)
src/layouts/
  ProposalLayout.astro     ← DONE, shared
src/pages/proposals/
  a.astro                  ← DONE (original proposal A)
  b.astro                  ← DONE (original proposal B)
```

---

## User Feedback on Original Proposals

**What user liked about the EXISTING live site (current homepage):**
1. Logo is clearly visible
2. Centre name and address clearly visible
3. Prayer times are clearly visible

**User concerns about original proposals:**
- Hero sections take considerable space but don't deliver enough impact
- Gradient + tagline feels decorative, not functional — visitors already know what the site is
- A mosque community centre website should frontload useful information, not look like a tech startup

**User's own ideas:**
1. Show new centre info with video in hero
2. Image carousel/slideshow showing programs
3. Split hero section

---

## 3 New Proposals to Build

### Proposal C: "Split Hero — Info + Dynamic Content" (RECOMMENDED)
**Page:** `/proposals/c`
**Nav variant:** `"a"` (solid)

**Left side (40-45%):**
- Logo (large, prominent)
- "Omar Ibn Al Khattab Centre" heading + full address
- Today's prayer times in a compact mini-card (all 5 prayers, next highlighted)
- Two CTAs: "View All Prayer Times" + "Donate"

**Right side (55-60%):**
- Auto-rotating content showcase (carousel/slideshow) cycling through:
  - New centre campaign: video embed or render image + "Learn more" link
  - Program images from existing assets (OIAC-Hifz-Program.webp, OIAC-Quran-Intensive-1.webp, OIAC-KARATE-scaled.webp, etc.) + captions + links
  - Event posters from the database (reuse poster fetching from PostersCarousel pattern)
- Auto-advances every 5s, manual prev/next + dots
- Each slide has caption + CTA link

**Mobile:** Stacks vertically — info section first (logo, name, prayer times), then carousel below.

**Why it works:** Information density + visual dynamism. Left answers "what do I need?", right answers "what's happening?" Both above the fold.

### Proposal D: "Compact Header + Content Grid"
**Page:** `/proposals/d`
**Nav variant:** `"a"` (solid)

**No traditional hero.** Instead:
- Row 1: Clean header (already handled by ProposalNav)
- Row 2: Prayer times as a prominent, beautifully designed full-width horizontal card/strip — this IS the hero element (most common reason to visit). Show all 5 prayers, next prayer highlighted, sunrise + jummah. Use warm colors, good spacing.
- Row 3: A 2-3 column card grid immediately below:
  - Card 1 (large/featured): New Centre campaign — video thumbnail or render, brief description, donate CTA, progress indicator if available
  - Card 2: Featured program or current event (could rotate or show latest poster)
  - Card 3: Quick actions (donate links, volunteer, contact) or upcoming event

**Mobile:** Prayer strip stacks, card grid becomes single column.

**Why it works:** Zero wasted space. Every pixel serves a purpose. Prayer times get the spotlight they deserve. Visual impact comes from clean design + color palette, not decorative gradients.

### Proposal E: "Multi-Panel Hero"
**Page:** `/proposals/e`
**Nav variant:** `"a"` (solid)

Full-width hero area divided into 2-3 visually distinct panels in a grid:
- **Panel 1 (60% width, tall):** New centre campaign — embedded video (Streamable iframe from `https://streamable.com/e/cvo5ln`) or image carousel of new centre renders (from `src/assets/new-centre/`), campaign description, donate CTA. This is the biggest initiative and deserves the spotlight.
- **Panel 2 (40% width, top half):** Prayer times card — compact, elegant, next prayer highlighted with countdown
- **Panel 3 (40% width, bottom half):** Program slideshow — rotating images of programs (school, Quran, karate) with captions and "Learn More" links

All panels share a cohesive visual treatment (e.g., deepTeal or softBeige backgrounds, card elevation, consistent border-radius).

**Mobile:** Panels stack vertically: Prayer times first, then new centre, then programs.

**Why it works:** Every panel serves a distinct purpose. The new centre campaign gets prime real estate. Prayer times are immediately visible. Programs showcase community vibrancy.

---

## Files to Create for New Proposals

| # | File | Status | Description |
|---|------|--------|-------------|
| 1 | `src/components/proposals/HeroC.astro` | TODO | Split hero: left info + right carousel |
| 2 | `src/components/proposals/HeroD.astro` | TODO | Prayer times hero strip + content grid |
| 3 | `src/components/proposals/HeroE.astro` | TODO | Multi-panel hero grid |
| 4 | `src/pages/proposals/c.astro` | TODO | Proposal C page |
| 5 | `src/pages/proposals/d.astro` | TODO | Proposal D page |
| 6 | `src/pages/proposals/e.astro` | TODO | Proposal E page |

**Note:** Reuse `PrayerTimesCardA` (floating card) and `PrayerTimesCardB` (horizontal strip) where appropriate, or create inline prayer displays within the hero components. Reuse ProposalLayout (variant "a" for all three — solid nav makes most sense since these are info-dense heroes, not full-bleed dark backgrounds).

---

## Key Code References

### Data fetching
- **Prayer times:** `src/lib/content/prayer-times.ts` → `getPrayerTimesForCurrentDay()` returns `PrayerTime | undefined`, `getJummahTimes()` returns `JummahTime[]`
- **Posters:** `src/lib/content/posters.ts` or check how `src/components/PostersCarousel.astro` fetches them — `getPosters()` from DB
- **Events:** `src/components/EventsAndPosts.astro` uses `getEventsForMonths([currentMonth])` from events content module
- **Slideshow:** `src/lib/db.ts` has slideshow functions; check `src/components/VideoShowcase.astro` for video data

### Existing components to reference/reuse patterns from
- `src/components/PostersCarousel.astro` — carousel with auto-advance, dots, swipe, keyboard nav (reuse pattern for program slideshow)
- `src/components/EventsAndPosts.astro` — has new centre section with Streamable video embed, poster carousel, events grid
- `src/components/NavPrayerTimes2.astro` — current prayer times display (reference for data shape)
- `src/components/VideoShowcase.astro` — video card grid with share buttons

### Assets available for program slideshow
- `src/assets/OIAC-Hifz-Program.webp` — Hifz program
- `src/assets/OIAC-Quran-Intensive-1.webp` — Quran intensive
- `src/assets/OIAC-KARATE-scaled.webp` — Karate program
- `src/assets/new-centre/new.oiac.5.png` — New centre exterior render (best one)
- `src/assets/new-centre/new.oiac.7.png` — New centre interior atrium
- `src/assets/new-centre/new.oiac.10.png` — New centre cafeteria
- `src/assets/new-centre/new.oiac.20.png` — New centre lounge

### Streamable video for new centre
- URL: `https://streamable.com/e/cvo5ln` (used in EventsAndPosts.astro)
- Embed as iframe with autoplay, muted

### Logos
- `src/assets/OIAC.Logo.Dark.png` — dark logo for light backgrounds
- `src/assets/OIAC.Logo.Light.png` — light logo for dark backgrounds

### Color palette (in tailwind.config.cjs — DO NOT modify)
- `warmWhite: #F2F0EC` — light backgrounds
- `terracottaRed: #8F4843` — primary brand, CTAs (has darker/lighter variants)
- `wood: #BB8452` — secondary warm accent (has variants)
- `lightWood: #C7A97B` — neutral accent (has variants)
- `softBeige: #D9CAB6` — soft backgrounds (has variants + lightest: #FAF4EC)
- `sageGreen: #8B8F65` — highlight accent (has variants)
- `deepTeal: #2E3F44` — text, dark backgrounds (flat, no variants)

### Icons
- `@lucide/astro` (NOT `lucide-astro`) — import as `import { IconName } from "@lucide/astro"`
- Already used in ProposalNav (Menu, X) and ProposalFooter (MapPin, Mail, Phone, Facebook, Instagram, Youtube)
- PrayerTimesCardA uses Clock, Sunrise
- PrayerTimesCardB uses Clock

### Global styles
- `src/styles/global.css` — Poppins font import, utility classes. Already imported in ProposalLayout.

---

## Architecture Notes
- Astro 5 + Tailwind CSS + Vercel adapter (SSR mode)
- Supabase for DB
- All proposal pages use `ProposalLayout` which includes `ProposalNav` + `ProposalFooter` + scroll animations
- Existing homepage components are imported directly into proposal pages below the hero
- Build with `npx astro build`, dev with `npx astro dev`
- No existing files should be modified — only create new files

## Verification
1. `npx astro build` compiles cleanly
2. All proposal pages load: `/proposals/a` through `/proposals/e`
3. `/` (live homepage) is unchanged
4. Test responsive: 375px, 768px, 1024px, 1440px
5. Prayer times data loads, next-prayer highlighting works
6. Carousels auto-advance and have manual controls
7. Mobile nav drawer works (open/close/Escape)
8. Video embeds load (Streamable iframe)
