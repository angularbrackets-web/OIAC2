# Migration Handoff Document

**Date**: December 10, 2025
**Project**: OIAC Website - Hygraph to Content Collections + Vercel Postgres Migration
**Status**: 90% Complete - Ready for Final Testing & Deployment

---

## 🎯 Migration Objective

Migrate OIAC community website from Hygraph (hit free tier limits) to a completely free solution:
- **Static Content**: Astro Content Collections + Decap CMS
- **Dynamic Content**: Vercel Postgres

---

## ✅ What's Been Completed

### 1. Data Export & Migration (100% Done)
**Location**: `/hygraph-export/`

Exported all content from Hygraph:
- ✅ 3 Jobs → `/hygraph-export/jobs.json`
- ✅ 4 Posts → `/hygraph-export/posts.json`
- ✅ 22 Staff Members → `/hygraph-export/staff.json`
- ✅ 31 Prayer Times (Dec 2025) → `/hygraph-export/prayer-times.json`
- ✅ 2 Jummah Times → `/hygraph-export/jummah-times.json`
- ✅ 0 Events (none in Hygraph)

**Export Script**: `/scripts/export-hygraph-data.ts` (reusable if needed)

---

### 2. Astro Content Collections (100% Done)

**Schema Definition**: `/src/content/config.ts`
- Defined 5 collections: jobs, posts, staff, prayer-times, jummah-times
- All use Zod schemas for type safety

**Content Files**: `/src/content/*/*.json`
- All 62 items migrated to JSON format
- Files use slugified names (e.g., `elementary-teacher-full-time.json`)

**Helper Functions**: `/src/lib/content/*.ts`
- `jobs.ts` - getJobs(), getJob(id)
- `posts.ts` - getPosts()
- `staff.ts` - getStaffMembers(staffType?)
- `prayer-times.ts` - getPrayerTimesForCurrentDay(), getPrayerTimesForCurrentMonth(), getJummahTimes()
- `events.ts` - getEventsForMonths() (returns empty array, placeholder for future)

**Migration Script**: `/scripts/migrate-to-content-collections.ts`

---

### 3. Decap CMS Setup (100% Done)

**Admin Panel Files**:
- `/public/admin/index.html` - Entry point using CDN version
- `/public/admin/config.yml` - Configuration for all 5 content collections

**Configuration Details**:
- Backend: GitHub (`angularbrackets-web/OIAC2`, branch: `main`)
- Media folder: `public/images/uploads`
- Collections configured: Jobs, Posts, Staff, Prayer Times, Jummah Times
- Uses JSON format for all collections

**Access**: `https://oiac.ca/admin` (after deployment)

**Note**: Installed `decap-cms-app@3.9.0` with `--legacy-peer-deps` due to React version conflicts (non-critical)

---

### 4. Component Updates (100% Done)

**All components updated to use Content Collections instead of Hygraph**:

Changed from:
```typescript
import { getJobs } from '../graphql/jobs'
```

To:
```typescript
import { getJobs } from '../lib/content/jobs'
```

**Updated Files**:
- `/src/components/Jobs.astro` ✅
- `/src/pages/jobs/[id].astro` ✅
- `/src/components/LatestPosts.astro` ✅
- `/src/components/EventsAndPosts.astro` ✅
- `/src/components/Events.astro` ✅
- `/src/components/Staff.astro` ✅
- `/src/components/Imams.astro` ✅
- `/src/components/NavPrayerTimes.astro` ✅ (with null checks)
- `/src/components/NavPrayerTimes2.astro` ⚠️ (needs null checks)
- `/src/components/PrayerTimes.astro` ⚠️ (needs null checks)
- `/src/pages/prayertimes.astro` ⚠️ (needs null checks)

---

### 5. Vercel Postgres Setup (100% Done)

**Package Installed**: `@vercel/postgres@0.10.0` (with `--legacy-peer-deps`)

**Database Utilities**: `/src/lib/db.ts`
Functions:
- `createVolunteer(data)` - Insert volunteer with duplicate email check
- `getVolunteerByEmail(email)` - Check for existing volunteer
- `createUtmHit(data)` - Insert UTM tracking record
- `getUtmHits()` - Query all UTM hits
- `initDatabase()` - Create tables (one-time setup)

**API Routes Updated**:
- `/src/pages/api/volunteer/index.ts` ✅
  - POST endpoint for volunteer submissions
  - Checks for duplicate emails
  - Returns proper error messages

- `/src/pages/api/track/index.ts` ✅
  - GET endpoint for image pixel tracking
  - POST endpoint for form tracking
  - Validates UTM sources

**Database Schema**:
```sql
-- Table 1: volunteers
CREATE TABLE volunteers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  expertise VARCHAR(255),
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table 2: utm_hits
CREATE TABLE utm_hits (
  id SERIAL PRIMARY KEY,
  source VARCHAR(50) NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  donate_button_clicked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## ⚠️ What Remains To Be Done

### 1. Fix Prayer Times Null Checks (HIGH PRIORITY)

**Issue**: Three components access `prayerTimesForCurrentDay` without null checks, causing TypeScript errors.

**Files to Fix**:
1. `/src/components/NavPrayerTimes2.astro`
2. `/src/components/PrayerTimes.astro`
3. `/src/pages/prayertimes.astro`

**Solution**: Wrap content in conditional check
```astro
---
const prayerTimesForCurrentDay = await getPrayerTimesForCurrentDay()
---

{prayerTimesForCurrentDay && (
  <!-- All content using prayerTimesForCurrentDay goes here -->
  <div>{prayerTimesForCurrentDay.fajrBegins}</div>
)}
```

**Reference**: See `/src/components/NavPrayerTimes.astro` (lines 6-140) for completed example.

**Estimated Time**: 15 minutes

---

### 2. Set Up Vercel Postgres Database (USER ACTION)

**Location**: Vercel Dashboard → Storage

**Steps**:
1. Go to https://vercel.com → OIAC Project
2. Click **Storage** tab
3. Click **Create Database**
4. Select **Postgres**
5. Name: "oiac-database" (or any name)
6. Click **Create**

**Result**: Vercel automatically adds environment variables:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

**Estimated Time**: 2 minutes

---

### 3. Initialize Database Tables (USER ACTION)

**Option A: Via Vercel Dashboard (Recommended)**
1. Go to Storage → Your Database → **Query** tab
2. Copy SQL from `/MIGRATION_SUMMARY.md` lines 90-114
3. Run the SQL commands
4. Verify tables created

**Option B: Via API Endpoint (After Deployment)**
1. Create `/src/pages/api/init-db.ts`:
```typescript
import type { APIRoute } from 'astro';
import { initDatabase } from '../../lib/db';

export const GET: APIRoute = async () => {
  try {
    await initDatabase();
    return new Response(JSON.stringify({ status: 'success' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ status: 'error', message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
```
2. Visit `https://oiac.ca/api/init-db` once

**Estimated Time**: 1 minute

---

### 4. Test Build (AGENT ACTION)

**Command**: `npm run build`

**Expected Issues**:
- Prayer times null checks (see #1)
- Possible unused imports warnings (non-critical)

**Fix**: Add null checks to the 3 remaining files

**Success Criteria**: Build completes without errors

**Estimated Time**: 5 minutes

---

### 5. Configure Decap CMS Authentication (USER/AGENT ACTION)

**Current State**: GitHub backend configured, but needs OAuth setup for production

**Option A: Use Netlify Identity (Easiest)**
1. Create free Netlify account
2. Set up Identity service
3. Enable Git Gateway
4. Update `/public/admin/config.yml` if needed

**Option B: GitHub OAuth App (More Control)**
1. Create GitHub OAuth App
2. Set authorization callback URL
3. Update Decap config with client ID
4. Store client secret in Vercel env vars

**Current Config**: Set for GitHub backend, will work once OAuth is configured

**Priority**: MEDIUM (admin panel works locally, needs setup for production)

**Estimated Time**: 10-15 minutes

---

### 6. Add More Prayer Times Data (USER ACTION)

**Current State**: Only December 2025 prayer times exist (31 entries)

**Location**: Admin panel `/admin` → Prayer Times

**Action Needed**: Add prayer times for:
- January 2026 and beyond
- Or remaining months of 2025

**How**:
1. Access admin panel
2. Navigate to "Prayer Times"
3. Add entries for each day of each month
4. Use format: month (1-12), day (1-31), times (HH:MM format)

**Priority**: MEDIUM (site works, but only shows times for Dec 2025)

**Estimated Time**: 2-3 hours for a full year (can be done incrementally)

---

## 🔑 Key Decisions Made

### 1. Database Choice: Vercel Postgres vs. Xata
**Decision**: Vercel Postgres
**Reason**:
- Xata no longer has free tier
- Vercel Postgres is native to deployment platform
- 256 MB free tier is more than sufficient (~1% usage expected)
- Auto-configuration of environment variables
- Standard SQL vs. proprietary API

### 2. CMS Choice: Decap CMS vs. Tina CMS
**Decision**: Decap CMS
**Reason**:
- 100% free with unlimited users
- Git-based (content in version control)
- No separate hosting needed
- Tina CMS free tier limited to 2 editors

### 3. Content Format: JSON vs. Markdown
**Decision**: JSON for all collections
**Reason**:
- Easier migration from Hygraph JSON structure
- Better for structured data (dates, arrays, objects)
- Consistent with existing data format
- Decap CMS handles both equally well

### 4. Migration Strategy: Big Bang vs. Incremental
**Decision**: Big bang (all at once)
**Reason**:
- Small dataset (62 items)
- Hitting Hygraph limits (urgent)
- Cleaner cutover
- Less dual-maintenance

---

## 📁 File Structure Reference

```
/Users/mohammad/Projects/OIAC2/
│
├── hygraph-export/              # Original exported data
│   ├── jobs.json
│   ├── posts.json
│   ├── staff.json
│   ├── prayer-times.json
│   └── jummah-times.json
│
├── src/
│   ├── content/                 # NEW: Content Collections
│   │   ├── config.ts           # Schema definitions
│   │   ├── jobs/*.json         # 3 jobs
│   │   ├── posts/*.json        # 4 posts
│   │   ├── staff/*.json        # 22 staff
│   │   ├── prayer-times/*.json # 31 prayer times
│   │   └── jummah-times/*.json # 2 jummah times
│   │
│   ├── lib/
│   │   ├── content/            # NEW: Content Collection helpers
│   │   │   ├── jobs.ts
│   │   │   ├── posts.ts
│   │   │   ├── staff.ts
│   │   │   ├── prayer-times.ts
│   │   │   └── events.ts
│   │   └── db.ts               # NEW: Vercel Postgres utilities
│   │
│   ├── pages/
│   │   ├── api/
│   │   │   ├── volunteer/index.ts  # UPDATED: Uses Vercel Postgres
│   │   │   └── track/index.ts      # UPDATED: Uses Vercel Postgres
│   │   ├── jobs.astro              # UPDATED: Uses Content Collections
│   │   ├── jobs/[id].astro         # UPDATED: Uses Content Collections
│   │   └── prayertimes.astro       # UPDATED: Needs null check
│   │
│   ├── components/
│   │   ├── Jobs.astro              # UPDATED
│   │   ├── LatestPosts.astro       # UPDATED
│   │   ├── Events.astro            # UPDATED
│   │   ├── EventsAndPosts.astro    # UPDATED
│   │   ├── Staff.astro             # UPDATED
│   │   ├── Imams.astro             # UPDATED
│   │   ├── NavPrayerTimes.astro    # UPDATED with null checks ✅
│   │   ├── NavPrayerTimes2.astro   # UPDATED needs null checks ⚠️
│   │   └── PrayerTimes.astro       # UPDATED needs null checks ⚠️
│   │
│   └── graphql/                    # OLD: Can be removed after verification
│       ├── jobs.ts
│       ├── posts.ts
│       ├── staff.ts
│       ├── prayer-times.ts
│       └── apollo-client.ts
│
├── public/
│   └── admin/                      # NEW: Decap CMS
│       ├── index.html
│       └── config.yml
│
├── scripts/
│   ├── export-hygraph-data.ts      # Migration tool (keep for reference)
│   └── migrate-to-content-collections.ts  # Migration tool (keep for reference)
│
├── MIGRATION_SUMMARY.md            # User-facing documentation
├── HANDOFF_DOCUMENT.md             # This file - Agent handoff
└── MigrationPlanDiscussion.txt     # Original planning conversation
```

---

## 🚨 Known Issues & Gotchas

### 1. React Version Conflicts
**Issue**: Decap CMS requires React 19, project uses React 18
**Solution**: Installed with `--legacy-peer-deps`
**Impact**: Non-critical, CMS works fine
**Watch For**: May see warnings during npm install

### 2. Prayer Times Only for December 2025
**Issue**: Only 31 entries (one month)
**Solution**: User needs to add more months via admin panel
**Impact**: Medium - site shows no prayer times for other months
**Watch For**: Users asking why prayer times missing

### 3. TypeScript Strict Mode Errors
**Issue**: `prayerTimesForCurrentDay` can be undefined
**Solution**: Add null checks (see task #1)
**Impact**: Blocks build
**Watch For**: Build errors in CI/CD

### 4. GraphQL Dependencies Still Installed
**Issue**: @apollo/client and graphql packages still in package.json
**Solution**: Can be removed after verification, but not urgent
**Impact**: Low - slightly larger node_modules
**Watch For**: None, works fine

### 5. Xata Configuration Still Present
**Issue**: `/src/xata.ts` and `@xata.io/client` in package.json
**Solution**: Can be removed, no longer used
**Impact**: None - not imported anywhere
**Watch For**: Confusion if future dev sees xata.ts

---

## 🔍 Testing Checklist

### After Fixing Null Checks:
- [ ] `npm run build` completes successfully
- [ ] No TypeScript errors
- [ ] All pages render (jobs, staff, prayer times)

### After Database Setup:
- [ ] Volunteer form submission works
- [ ] Duplicate email detection works
- [ ] UTM tracking records hits
- [ ] Check Vercel function logs for errors

### After Deployment:
- [ ] Admin panel loads at `/admin`
- [ ] Can authenticate with GitHub
- [ ] Can edit existing content
- [ ] Can create new content
- [ ] Changes commit to GitHub
- [ ] Site auto-deploys on commit

---

## 💡 Quick Fixes Reference

### Fix Prayer Times Null Checks
```astro
<!-- Before -->
<div>{prayerTimesForCurrentDay.fajrBegins}</div>

<!-- After -->
{prayerTimesForCurrentDay && (
  <div>{prayerTimesForCurrentDay.fajrBegins}</div>
)}
```

### Test Database Connection
```typescript
// Create /src/pages/api/test-db.ts
import { sql } from '@vercel/postgres';
export const GET = async () => {
  const result = await sql`SELECT NOW()`;
  return new Response(JSON.stringify(result.rows));
};
```

### Check Volunteer Duplicates
```sql
-- In Vercel Dashboard → Query
SELECT email, COUNT(*) FROM volunteers GROUP BY email HAVING COUNT(*) > 1;
```

### View Recent UTM Hits
```sql
-- In Vercel Dashboard → Query
SELECT * FROM utm_hits ORDER BY timestamp DESC LIMIT 10;
```

---

## 📞 Context for Next Agent

### Project Background
- **Site**: oiac.ca (Omar Ibn Al-Khattab Centre - Edmonton Islamic community)
- **Tech Stack**: Astro, Tailwind, Vercel
- **Traffic**: Low-medium (community site)
- **Users**: Non-technical content editors

### Why This Migration
- Hit Hygraph free tier limits
- Couldn't add new content
- Needed 100% free solution
- Required easy content editing

### User's Technical Level
- Can use GitHub
- Can navigate Vercel dashboard
- Comfortable with basic terminal commands
- Not a developer (needs clear instructions)

### Deployment Info
- Platform: Vercel
- Auto-deploys on git push
- GitHub repo: angularbrackets-web/OIAC2
- Branch: main

### Priority Order
1. Fix TypeScript errors (blocks deployment)
2. Set up database (needed for forms)
3. Test everything
4. Deploy
5. Configure admin auth (can be done post-deploy)
6. Add more prayer times (ongoing)

---

## 📚 Documentation Locations

- **User Guide**: `/MIGRATION_SUMMARY.md` (comprehensive setup instructions)
- **This Handoff**: `/HANDOFF_DOCUMENT.md` (agent continuation guide)
- **Original Discussion**: `/MigrationPlanDiscussion.txt` (context)
- **Decap CMS Docs**: https://decapcms.org/docs/
- **Vercel Postgres Docs**: https://vercel.com/docs/storage/vercel-postgres
- **Astro Content Collections**: https://docs.astro.build/en/guides/content-collections/

---

## ✅ Agent Continuation Commands

### To Resume Work:

```bash
# 1. Fix remaining TypeScript errors
# Edit these 3 files and add null checks:
# - /src/components/NavPrayerTimes2.astro
# - /src/components/PrayerTimes.astro
# - /src/pages/prayertimes.astro

# 2. Test build
npm run build

# 3. If build passes, commit
git add .
git commit -m "Fix prayer times null checks and complete Hygraph migration"

# 4. Show user what's ready to deploy
echo "✅ Migration complete! Ready to:"
echo "1. Create Vercel Postgres database (user action)"
echo "2. Initialize database tables (user action)"
echo "3. Deploy with: git push"
```

### To Verify Everything:

```bash
# Check all content collections exist
ls -la src/content/jobs/
ls -la src/content/posts/
ls -la src/content/staff/
ls -la src/content/prayer-times/
ls -la src/content/jummah-times/

# Check database utilities exist
cat src/lib/db.ts

# Check admin panel exists
cat public/admin/config.yml

# Run build
npm run build
```

---

## 🎯 Success Criteria

Migration is complete when:
1. ✅ Build passes with no errors
2. ✅ All static content renders correctly
3. ✅ Database is created and tables initialized
4. ✅ Volunteer form works
5. ✅ UTM tracking works
6. ✅ Admin panel accessible and functional

---

## 📨 Message for User

When ready to hand off to user:

> **Migration is 90% complete!** Here's what's ready:
>
> ✅ All 62 content items migrated to Content Collections
> ✅ Decap CMS admin panel configured
> ✅ Vercel Postgres code ready
> ✅ All API routes updated
>
> **Quick remaining steps:**
> 1. I need to fix 3 small TypeScript errors (5 min)
> 2. You'll create Vercel Postgres database (2 min)
> 3. Initialize database tables (1 min)
> 4. Deploy!
>
> See `MIGRATION_SUMMARY.md` for complete instructions.

---

**End of Handoff Document**

*Last Updated: December 10, 2025*
*Migration Status: 90% Complete*
*Next Agent: Fix prayer times null checks, verify build, prepare for deployment*
