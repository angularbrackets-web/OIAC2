# Admin UI/UX Redesign — Resume Context

## What Was Done
1. Thorough code review of all 10 admin pages + layout + login
2. Playwright screenshots of all pages at 1440px, 1024px, 375px (in `admin-screenshots/`)
3. Extensive research on best-in-class admin UIs (Linear, Vercel, Supabase, Stripe, Payload, Sanity, Shopify Polaris)
4. Research on Tailwind admin patterns, icon libraries, native `<dialog>`, toast systems
5. Full implementation plan written

## What To Do Next — Start Implementation

### Prompt for new session:
> Read `admin-redesign-context.md` and `~/.claude/plans/prancy-gliding-sutherland.md` for the full admin redesign plan. Implement it starting from Phase 1 (foundation components). The plan was already reviewed and approved.

### Phase 1 (do first):
1. `npm install @lucide/astro`
2. Create `src/components/admin/` directory
3. Build these components in order:
   - `src/scripts/admin-utils.js` — shared JS utilities
   - `src/components/admin/AdminToast.astro` — toast notification system
   - `src/components/admin/AdminConfirm.astro` — styled confirm dialog
   - `src/components/admin/AdminModal.astro` — native `<dialog>` modal
   - `src/components/admin/AdminPageHeader.astro` — page header
   - `src/components/admin/AdminBadge.astro` — status badges
   - `src/components/admin/AdminEmptyState.astro` — empty states
   - `src/components/admin/AdminFilterBar.astro` — filter chips
   - `src/components/admin/AdminSidebar.astro` — sidebar navigation
   - `src/components/admin/AdminMediaPicker.astro` — shared media picker
   - `src/layouts/AdminLayout2.astro` — new sidebar layout shell
4. Add modal animation keyframes to `tailwind.config.cjs`

### Phase 2: Dashboard redesign (`src/pages/admin/index.astro`)
- Replace rainbow gradient cards with neutral stats + quick-action cards

### Phase 3: Migrate pages (simplest to most complex)
1. Jummah Times → 2. Feedback → 3. Jobs → 4. Posters → 5. Slideshow → 6. Staff → 7. Media → 8. Prayer Times → 9. New Centre Updates

### Phase 4: Cleanup
- Rename AdminLayout2 → AdminLayout, delete old
- Remove all seed data buttons, SQL in error messages
- Verify zero alert(), confirm(), !important

### Phase 5: Login page polish

## Key Design Decisions
- **Layout**: Fixed sidebar (w-64/256px) + content area (bg-gray-50)
- **Icons**: `@lucide/astro` (inline SVG, zero JS)
- **Modals**: Native `<dialog>` element (built-in focus trap, ESC, backdrop)
- **Toasts**: Custom vanilla JS, fixed bottom-right, 4 variants
- **Color**: Single accent blue-600 + neutral grays (no rainbow)
- **Buttons**: 4 variants — Primary (blue), Secondary (outlined), Destructive (red), Ghost (text)
- **Active nav**: `bg-blue-50 text-blue-700`

## Nav Structure
```
CONTENT:    Slideshow (Play) | Posters (Image) | New Centre Updates (Building2)
MANAGEMENT: Jobs (Briefcase) | Staff (Users)
PRAYER:     Prayer Times (Clock) | Jummah Times (BookOpen)
SYSTEM:     Media Library (FolderOpen) | Feedback (MessageSquare)
BOTTOM:     View Site (ExternalLink) | Sign Out (LogOut)
```

## Key Files
- Current layout: `src/layouts/AdminLayout.astro`
- Admin pages: `src/pages/admin/*.astro`
- API endpoints: `src/pages/api/cms/*.ts`
- DB layer: `src/lib/db.ts`
- Auth: `src/middleware.ts`
- Tailwind config: `tailwind.config.cjs`
- Production: oiacedmonton.ca/admin (password: OIAC_ADMIN)

## Cleanup After Done
- Delete `admin-review.mjs`
- Delete `admin-screenshots/` directory
- Delete this file (`admin-redesign-context.md`)
