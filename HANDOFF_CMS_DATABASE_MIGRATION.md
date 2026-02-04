# Handoff: Migrate CMS Content to Supabase + Cloudinary

**Date Created**: December 11, 2025
**Project**: OIAC2 Website
**Status**: Ready for Implementation

## Context

### Current Situation
- **CMS**: Decap CMS (formerly Netlify CMS) configured and working
- **Content Storage**: JSON files in `src/content/` committed to GitHub
- **Image Storage**: `public/images/uploads/` committed to GitHub
- **Hosting**: Vercel with SSR mode (`output: "server"`)
- **Database**: Supabase already configured (see `src/lib/db.ts`)

### The Problem
When content editors make changes in Decap CMS:
1. Changes commit to GitHub ✅
2. Vercel auto-deploys (1-3 min delay) ⏳
3. Users must wait for rebuild to see updates ❌

This is not a good CMS experience. Content updates should be **instant**.

### Current File Structure
```
src/content/
├── posts/
│   ├── winter-quran-camp.json
│   ├── register-now.json
│   ├── quran-beginnerbidaya.json
│   ├── quranic-light.json
│   └── weekend-islamic-school.json
├── jobs/ (5 JSON files)
├── staff/ (multiple JSON files)
├── prayer-times/ (365 JSON files)
└── jummah-times/ (JSON files)

public/images/uploads/
└── oiac_winterqurancamp2025.jpeg (293KB)
```

### Existing Database Setup
Supabase is already configured in `src/lib/db.ts` with:
- `oiac_volunteers` table
- `oiac_utm_hits` table
- Environment variables: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`

---

## Proposed Solution

### Architecture
1. **Content Storage**: Migrate JSON files to Supabase tables
2. **Media Storage**: Use Cloudinary for images/videos
3. **CMS Backend**: Update Decap CMS to write directly to Supabase
4. **Real-time Updates**: Pages fetch from Supabase at runtime (instant updates)

### Why Supabase + Cloudinary?
- ✅ Instant content updates (no rebuild needed)
- ✅ Supabase already configured in project
- ✅ Cloudinary provides image optimization, CDN, transformations
- ✅ Better media management (upload, resize, format conversion)
- ✅ Keep Git history for content (optional: sync back to Git)

---

## Implementation Plan

### Phase 1: Database Schema Design

#### 1.1 Create Supabase Tables

Run this SQL in Supabase SQL Editor:

```sql
-- Posts Table
CREATE TABLE oiac_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  image_urls JSONB DEFAULT '[]'::jsonb, -- Array of Cloudinary URLs
  link_text TEXT,
  link_url TEXT,
  content TEXT[], -- Array of content paragraphs
  priority INTEGER DEFAULT 999,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs Table
CREATE TABLE oiac_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  posted_date DATE NOT NULL,
  description TEXT, -- HTML/Markdown
  require_alberta_certification BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Staff Table
CREATE TABLE oiac_staff (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT,
  slug TEXT UNIQUE NOT NULL,
  profile_picture_url TEXT, -- Cloudinary URL
  staff_type TEXT CHECK (staff_type IN ('Imam', 'Board Member', 'Teacher', 'Administrator', 'Support Staff')),
  description TEXT, -- HTML/Markdown
  display_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prayer Times Table
CREATE TABLE oiac_prayer_times (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  month INTEGER CHECK (month >= 1 AND month <= 12),
  day INTEGER CHECK (day >= 1 AND day <= 31),
  fajr_begins TEXT NOT NULL,
  fajr_jamah TEXT NOT NULL,
  sunrise TEXT NOT NULL,
  zuhr_begins TEXT NOT NULL,
  zuhr_jamah TEXT NOT NULL,
  asr_begins TEXT NOT NULL,
  asr_jamah TEXT NOT NULL,
  maghrib_begins TEXT NOT NULL,
  maghrib_jamah TEXT NOT NULL,
  isha_begins TEXT NOT NULL,
  isha_jamah TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(month, day)
);

-- Jummah Times Table
CREATE TABLE oiac_jummah_times (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  time TEXT NOT NULL,
  display_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_posts_priority ON oiac_posts(priority);
CREATE INDEX idx_posts_active ON oiac_posts(active);
CREATE INDEX idx_jobs_active ON oiac_jobs(active);
CREATE INDEX idx_staff_display_order ON oiac_staff(display_order);
CREATE INDEX idx_prayer_times_month_day ON oiac_prayer_times(month, day);
CREATE INDEX idx_jummah_times_order ON oiac_jummah_times(display_order);

-- Enable Row Level Security (RLS)
ALTER TABLE oiac_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE oiac_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE oiac_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE oiac_prayer_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE oiac_jummah_times ENABLE ROW LEVEL SECURITY;

-- Create policies (allow public read, service role write)
CREATE POLICY "Enable read access for all users" ON oiac_posts FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON oiac_jobs FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON oiac_staff FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON oiac_prayer_times FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON oiac_jummah_times FOR SELECT USING (true);
```

#### 1.2 Create Updated Timestamp Trigger

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables
CREATE TRIGGER update_oiac_posts_updated_at BEFORE UPDATE ON oiac_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_oiac_jobs_updated_at BEFORE UPDATE ON oiac_jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_oiac_staff_updated_at BEFORE UPDATE ON oiac_staff FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_oiac_prayer_times_updated_at BEFORE UPDATE ON oiac_prayer_times FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_oiac_jummah_times_updated_at BEFORE UPDATE ON oiac_jummah_times FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Phase 2: Cloudinary Setup

#### 2.1 Create Cloudinary Account
1. Sign up at https://cloudinary.com (free tier: 25 credits/month)
2. Get credentials from Dashboard:
   - Cloud Name
   - API Key
   - API Secret

#### 2.2 Add Environment Variables
Add to Vercel environment variables:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### 2.3 Install Cloudinary SDK
```bash
npm install cloudinary
npm install @cloudinary/url-gen @cloudinary/react
```

### Phase 3: Data Migration

#### 3.1 Create Migration Script

Create `scripts/migrate-to-supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function migratePosts() {
  const postsDir = 'src/content/posts';
  const files = fs.readdirSync(postsDir);

  for (const file of files) {
    const content = JSON.parse(fs.readFileSync(path.join(postsDir, file), 'utf-8'));
    const slug = file.replace('.json', '');

    // Upload images to Cloudinary
    const imageUrls = [];
    for (const img of content.image || []) {
      if (img.url.startsWith('/images/uploads/')) {
        // Local image - upload to Cloudinary
        const localPath = path.join('public', img.url);
        const result = await cloudinary.uploader.upload(localPath, {
          folder: 'oiac/posts',
          public_id: slug
        });
        imageUrls.push(result.secure_url);
      } else {
        // External URL - keep as is
        imageUrls.push(img.url);
      }
    }

    // Insert into Supabase
    const { error } = await supabase.from('oiac_posts').insert({
      title: content.title,
      slug,
      image_urls: imageUrls,
      link_text: content.link?.text,
      link_url: content.link?.url,
      content: content.content || [],
      priority: content.priority || 999
    });

    if (error) console.error(`Error migrating ${file}:`, error);
    else console.log(`Migrated ${file} ✓`);
  }
}

// Similar functions for jobs, staff, prayer-times, jummah-times
// migrateJobs(), migrateStaff(), migratePrayerTimes(), migrateJummahTimes()

async function main() {
  await migratePosts();
  // await migrateJobs();
  // await migrateStaff();
  // await migratePrayerTimes();
  // await migrateJummahTimes();
  console.log('Migration complete!');
}

main();
```

Run with:
```bash
npx tsx scripts/migrate-to-supabase.ts
```

### Phase 4: Update Content Fetching

#### 4.1 Update `src/lib/content/posts.ts`

```typescript
import { supabase } from '../db';

export type OIAC_PostImage = {
  url: string;
};

export type OIAC_Hyperlink = {
  text: string;
  url: string;
};

export type OIAC_Post = {
  id: string;
  title: string;
  image: Array<OIAC_PostImage>;
  link: OIAC_Hyperlink;
  content: Array<string>;
  priority?: number;
};

export async function getPosts(): Promise<OIAC_Post[]> {
  const { data, error } = await supabase
    .from('oiac_posts')
    .select('*')
    .eq('active', true)
    .order('priority', { ascending: true });

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  return data.map(post => ({
    id: post.id,
    title: post.title,
    image: (post.image_urls || []).map((url: string) => ({ url })),
    link: {
      text: post.link_text || '',
      url: post.link_url || ''
    },
    content: post.content || [],
    priority: post.priority
  }));
}
```

#### 4.2 Update Other Content Files
- `src/lib/content/jobs.ts`
- `src/lib/content/staff.ts`
- `src/lib/content/prayer-times.ts`
- `src/lib/content/jummah-times.ts`

Follow the same pattern as posts.

#### 4.3 Export supabase from db.ts

Update `src/lib/db.ts`:
```typescript
export { supabase }; // Add this export
```

### Phase 5: Create API Endpoints for Decap CMS

Decap CMS needs API endpoints to write to Supabase.

#### 5.1 Create API Routes

Create `src/pages/api/cms/posts.ts`:

```typescript
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/db';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    const { error } = await supabase.from('oiac_posts').insert({
      title: data.title,
      slug: data.slug || data.title.toLowerCase().replace(/\s+/g, '-'),
      image_urls: data.image?.map((img: any) => img.url) || [],
      link_text: data.link?.text,
      link_url: data.link?.url,
      content: data.content || [],
      priority: data.priority || 999
    });

    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { id, ...updates } = data;

    const { error } = await supabase
      .from('oiac_posts')
      .update(updates)
      .eq('id', id);

    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const { id } = await request.json();

    const { error } = await supabase
      .from('oiac_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
```

Create similar endpoints for:
- `src/pages/api/cms/jobs.ts`
- `src/pages/api/cms/staff.ts`
- `src/pages/api/cms/prayer-times.ts`
- `src/pages/api/cms/jummah-times.ts`

#### 5.2 Create Cloudinary Upload Endpoint

Create `src/pages/api/cms/upload.ts`:

```typescript
import type { APIRoute } from 'astro';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: import.meta.env.CLOUDINARY_CLOUD_NAME,
  api_key: import.meta.env.CLOUDINARY_API_KEY,
  api_secret: import.meta.env.CLOUDINARY_API_SECRET
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'oiac', resource_type: 'auto' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return new Response(JSON.stringify({ url: result.secure_url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
```

### Phase 6: Configure Decap CMS Backend

#### 6.1 Option A: Custom Backend Adapter (Recommended)

Create a custom Decap CMS backend that talks to your API:

Create `public/admin/supabase-backend.js`:

```javascript
class SupabaseBackend {
  constructor(config, options = {}) {
    this.config = config;
    this.api_root = config.api_root || '/api/cms';
  }

  async allEntries(collection) {
    const response = await fetch(`${this.api_root}/${collection}/all`);
    return response.json();
  }

  async entriesByFolder(collection, extension) {
    return this.allEntries(collection);
  }

  async getEntry(collection, slug, path) {
    const response = await fetch(`${this.api_root}/${collection}/${slug}`);
    return response.json();
  }

  async persistEntry({ dataFiles, assets }, options) {
    const [{ path, slug, raw }] = dataFiles;
    const data = JSON.parse(raw);

    const response = await fetch(`${this.api_root}/${options.collectionName}`, {
      method: options.isModification ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    return response.json();
  }

  async deleteEntry(collection, slug) {
    const response = await fetch(`${this.api_root}/${collection}/${slug}`, {
      method: 'DELETE'
    });
    return response.json();
  }

  async getMedia() {
    // Return list of Cloudinary images
    return [];
  }

  async persistMedia(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.api_root}/upload`, {
      method: 'POST',
      body: formData
    });

    const { url } = await response.json();
    return { url };
  }

  async deleteMedia(path) {
    // Delete from Cloudinary
    return true;
  }
}

// Register the backend
window.CMS.registerBackend('supabase', SupabaseBackend);
```

#### 6.2 Update `public/admin/index.html`

```html
<script src="supabase-backend.js"></script>
<script>
  (function() {
    var initCMS = function() {
      if (window.CMS) {
        window.CMS.init({
          config: {
            backend: {
              name: 'supabase',  // Changed from 'github'
              api_root: '/api/cms'
            },
            media_folder: 'cloudinary',  // Virtual folder
            public_folder: 'cloudinary',
            collections: [
              // ... existing collections config
            ]
          }
        });
      }
    };
    initCMS();
  })();
</script>
```

#### 6.3 Option B: Keep GitHub Backend + Webhook

Keep using GitHub backend but add a webhook to sync to Supabase:

1. Create `src/pages/api/webhook/github.ts` to receive GitHub webhook
2. On push to main, parse changed files and update Supabase
3. Configure webhook in GitHub repo settings

### Phase 7: Testing Checklist

- [ ] Supabase tables created successfully
- [ ] Migration script runs without errors
- [ ] All existing content appears in Supabase
- [ ] Images uploaded to Cloudinary
- [ ] `getPosts()` returns data from Supabase
- [ ] Home page displays posts from database
- [ ] API endpoints work (create, update, delete)
- [ ] Decap CMS can create new posts
- [ ] Decap CMS can edit existing posts
- [ ] Decap CMS can upload images to Cloudinary
- [ ] New posts appear on site immediately (no rebuild)
- [ ] Image transformations work (Cloudinary CDN)

### Phase 8: Cleanup

After successful migration:
1. Archive `src/content/` directory to `src/content.backup/`
2. Remove `public/images/uploads/` (images now on Cloudinary)
3. Update `.gitignore` to ignore old content directories
4. Update `public/admin/config.yml` if still using file-based config

---

## File Changes Summary

### Files to Create
- `scripts/migrate-to-supabase.ts` - Migration script
- `src/pages/api/cms/posts.ts` - API for posts
- `src/pages/api/cms/jobs.ts` - API for jobs
- `src/pages/api/cms/staff.ts` - API for staff
- `src/pages/api/cms/prayer-times.ts` - API for prayer times
- `src/pages/api/cms/jummah-times.ts` - API for jummah times
- `src/pages/api/cms/upload.ts` - Cloudinary upload
- `public/admin/supabase-backend.js` - Custom CMS backend

### Files to Modify
- `src/lib/db.ts` - Export supabase client
- `src/lib/content/posts.ts` - Fetch from Supabase
- `src/lib/content/jobs.ts` - Fetch from Supabase
- `src/lib/content/staff.ts` - Fetch from Supabase
- `src/lib/content/prayer-times.ts` - Fetch from Supabase
- `src/lib/content/jummah-times.ts` - Fetch from Supabase
- `public/admin/index.html` - Update backend config
- `package.json` - Add cloudinary dependency

### Files to Archive (After Migration)
- `src/content/posts/*.json` → move to `src/content.backup/`
- `public/images/uploads/*` → delete after Cloudinary upload

---

## Environment Variables Required

Add these to Vercel:

```env
# Existing (should already be set)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# New - Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

## Rollback Plan

If something goes wrong:

1. Keep `src/content.backup/` with all original JSON files
2. Revert changes to `src/lib/content/*.ts` files
3. Use Astro's `getCollection()` to read from JSON files again
4. Decap CMS will still work with GitHub backend

---

## Additional Considerations

### Caching Strategy
Consider adding caching for better performance:
```typescript
export async function getPosts(): Promise<OIAC_Post[]> {
  const { data, error } = await supabase
    .from('oiac_posts')
    .select('*')
    .eq('active', true)
    .order('priority', { ascending: true });

  // Add Vercel Edge caching
  return data;
}
```

### Image Optimization with Cloudinary
Use Cloudinary transformations for responsive images:
```typescript
import { Cloudinary } from "@cloudinary/url-gen";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";

const cld = new Cloudinary({ cloud: { cloudName: 'your-cloud-name' } });

const img = cld.image('sample')
  .resize(auto().gravity(autoGravity()).width(500))
  .format('auto')
  .quality('auto');
```

### Real-time Updates (Future Enhancement)
Use Supabase Realtime to push updates without page refresh:
```typescript
supabase
  .channel('posts-changes')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'oiac_posts' }, payload => {
    console.log('Post updated:', payload);
    // Refresh posts on the page
  })
  .subscribe();
```

---

## Questions for Next Session

Before starting implementation, confirm:
1. Do you want to keep GitHub as source of truth (Option B) or go full Supabase (Option A)?
2. Should we migrate all collections (posts, jobs, staff, etc.) or start with posts only?
3. Any specific Cloudinary transformations needed (auto-crop, specific sizes, etc.)?
4. Do you need admin authentication for CMS endpoints?

---

## Resources

- [Supabase JavaScript Client Docs](https://supabase.com/docs/reference/javascript/introduction)
- [Cloudinary Upload API](https://cloudinary.com/documentation/upload_images)
- [Decap CMS Custom Backends](https://decapcms.org/docs/custom-backends/)
- [Astro API Routes](https://docs.astro.build/en/core-concepts/endpoints/)

---

**Ready to implement in next session!** 🚀
