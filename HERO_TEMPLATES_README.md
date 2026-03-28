# Hero Templates Management System

## Overview

The hero templates system allows admins to manage the homepage hero section from the admin panel. Multiple templates can be created, and one is designated as "active" to display on the homepage.

## Architecture

### Database Layer
- **Table**: `hero_templates` (Supabase)
- **Fields**:
  - `id` (UUID, primary key)
  - `title` (text) - Main headline
  - `badge` (text) - Badge/label text (e.g., "UPCOMING PROJECT")
  - `subtitle` (text, optional) - Additional description
  - `background_type` (enum: 'color' | 'image') - Background implementation
  - `background_color` (text) - Hex color when type is 'color'
  - `background_image_url` (text) - Image URL when type is 'image'
  - `cta_text` (text) - Call-to-action button text
  - `cta_link` (text) - CTA button destination URL
  - `is_active` (boolean) - Marks the active template for homepage display
  - `display_order` (integer) - Sort order in admin list
  - `created_at`, `updated_at` (timestamps)

### Backend API
- **Endpoint**: `/api/cms/hero-templates`
- **Methods**:
  - `GET` - Fetch all templates or specific template by `id` query param
  - `GET ?active=true` - Fetch the currently active template
  - `POST` - Create new template
  - `PUT` - Update template (auto-deactivates others if setting as active)
  - `DELETE` - Delete template (blocked if template is active)

### Frontend Components
- **Admin Page**: `/admin/hero-templates` 
  - Create, edit, delete hero templates
  - Radio button to set one as active
  - Preview thumbnails showing badge + title + background
  - Background type toggle (color picker vs. image upload)

- **Homepage Component**: `NewCentreAndCarousel.astro`
  - Accepts optional `heroTemplate` prop
  - Falls back to hardcoded design if no template provided
  - Renders dynamic badge, title, subtitle, background, CTA
  - Keeps existing video/donation content separate

- **Homepage Page**: `src/pages/index.astro`
  - Fetches active template via `getActiveHeroTemplate()`
  - Passes template to `NewCentreAndCarousel` component

## Setup Instructions

### 1. Create Database Table

Run the SQL migration in Supabase SQL Editor:

```bash
# Copy and paste the contents of: scripts/hero-templates-migration.sql
# into your Supabase SQL Editor and run
```

This creates:
- `hero_templates` table with proper schema
- Indexes for fast queries
- Initial seed template (replicating current hardcoded hero)

### 2. Deploy Code

The code is ready to deploy:
- API endpoints: `src/pages/api/cms/hero-templates.ts`
- Admin page: `src/pages/admin/hero-templates.astro`
- Database functions: Added to `src/lib/db.ts`
- Homepage integration: `src/pages/index.astro` and `src/components/NewCentreAndCarousel.astro`

### 3. Verify Setup

1. **Homepage**: Visit home page, verify hero displays correctly
2. **Admin Page**: Visit `/admin/hero-templates`
3. **Create Template**: Click "Create Template" and create a new hero
4. **Set Active**: Use radio button to set a template as active
5. **Verify**: Homepage should update to show new active template

## Usage Guide

### For Admins

#### Creating a Hero Template

1. Navigate to `/admin/hero-templates`
2. Click "Create Template"
3. Fill in fields:
   - **Template Title** - Internal name (not shown to users)
   - **Badge Text** - Label text (e.g., "UPCOMING PROJECT")
   - **Subtitle** - Optional description below title
   - **Background Type** - Choose color or image
     - **Color**: Pick from color picker or enter hex code
     - **Image**: Enter image URL or browse media library
   - **CTA Button Text** - Button label (e.g., "Learn More")
   - **CTA Button Link** - Destination URL
4. Click "Save Template"

#### Setting Active Template

- Each template in the list has a radio button labeled "Active"
- Click the radio to set that template as the active one
- Only one template can be active at a time
- The active template displays on the homepage

#### Editing Template

1. Click the edit icon (pencil) on a template
2. Modify fields as needed
3. Click "Save Template"

#### Deleting Template

1. Click the delete icon (trash) on a template
2. Confirm when prompted
- **Note**: Cannot delete the currently active template; set another as active first

### For Developers

### API Endpoints

#### Get All Templates
```
GET /api/cms/hero-templates
```
Response: Array of HeroTemplateRecord objects

#### Get Active Template
```
GET /api/cms/hero-templates?active=true
```
Response: Single HeroTemplateRecord or 404 if none active

#### Get Specific Template
```
GET /api/cms/hero-templates?id={id}
```
Response: Single HeroTemplateRecord or 404

#### Create Template
```
POST /api/cms/hero-templates
Content-Type: application/json

{
  "title": "My Hero",
  "badge": "NEW",
  "subtitle": "Optional description",
  "backgroundType": "color",
  "backgroundColor": "#C84C3C",
  "ctaText": "Learn More",
  "ctaLink": "https://example.com"
}
```
Required fields: title, badge, backgroundType, ctaText, ctaLink, and appropriate background field (backgroundColor for color, backgroundImageUrl for image)

#### Update Template
```
PUT /api/cms/hero-templates
Content-Type: application/json

{
  "id": "{template-id}",
  "badge": "UPDATED",
  "isActive": true
}
```
- Pass only fields to update
- If `isActive` set to true, automatically deactivates all other templates

#### Delete Template
```
DELETE /api/cms/hero-templates
Content-Type: application/json

{
  "id": "{template-id}"
}
```
- Returns 400 error if template is currently active

### Database Functions

All functions are in `src/lib/db.ts`:

```typescript
// Create new template
createHeroTemplate(data: HeroTemplateInput): Promise<HeroTemplateRecord[]>

// Get all templates (ordered by display_order)
getHeroTemplates(): Promise<HeroTemplateRecord[]>

// Get single template by ID
getHeroTemplateById(id: string): Promise<HeroTemplateRecord | null>

// Get currently active template
getActiveHeroTemplate(): Promise<HeroTemplateRecord | null>

// Update template (handles isActive deactivation logic)
updateHeroTemplate(id: string, data: Partial<HeroTemplateInput>): Promise<HeroTemplateRecord[]>

// Delete template (throws if template is active)
deleteHeroTemplate(id: string): Promise<boolean>
```

### Component Usage

```astro
---
import { getActiveHeroTemplate } from "../lib/db";
import NewCentreAndCarousel from "../components/NewCentreAndCarousel.astro";

const activeTemplate = await getActiveHeroTemplate();
---

<NewCentreAndCarousel heroTemplate={activeTemplate} />
```

## Technical Details

### Background Handling

**Color Backgrounds**:
- Accepts hex color codes (e.g., `#C84C3C`)
- Stored in `background_color` field
- Rendered as inline style: `background: {color};`

**Image Backgrounds**:
- Accepts image URLs (uploaded via media picker or external URLs)
- Stored in `background_image_url` field
- Rendered as: `background-image: url(...); background-size: cover; background-position: center;`

### Active Template Logic

- Only one template can be `is_active = true` at a time
- When updating a template to `isActive: true`, the API automatically:
  1. Deactivates all other templates (sets `is_active = false`)
  2. Activates the selected template
  3. Returns the updated template

- Deletion is blocked for active templates via error in `deleteHeroTemplate()` function
- Homepage gracefully falls back to hardcoded hero if no active template exists

### Component Fallback

The `NewCentreAndCarousel` component includes fallback behavior:
- If no `heroTemplate` prop provided, uses hardcoded design
- If template provided but homepage fails to fetch it, homepage still renders with hardcoded hero
- Error handling wrapped in try-catch to prevent page crashes

## Future Enhancements

1. **Hero Scheduling**: Auto-activate templates on specific dates
2. **Live Preview**: Real-time preview before saving
3. **Rich Subtitle**: Support markdown/HTML in subtitle
4. **Multiple Active**: Use templates per-page (not just homepage)
5. **Background Overlay**: Add opacity/overlay controls for image backgrounds
6. **Animation Control**: Choose transition animations for hero display

## Troubleshooting

### Template not appearing on homepage

- **Check**: Is a template set as active? (green "Active" badge should show)
- **Check**: No database connection errors in server logs
- **Check**: Template `is_active` field is `true` in database

### Can't delete template

- **Issue**: "Cannot delete active template" error
- **Solution**: Set a different template as active first, then delete

### Background image not loading

- **Issue**: Image URL returns 403/404
- **Solution**: Ensure image URL is publicly accessible
- Use media picker to upload to trusted S3 or CDN

### Color picker not syncing

- **Issue**: Hex field and color input don't match
- **Solution**: Ensure color is valid hex format (e.g., `#C84C3C`)
- Refresh page if sync issue persists

## Migration Notes

During deployment:

1. Run `scripts/hero-templates-migration.sql` in Supabase first
2. Deploy code changes
3. Seed data is included in migration (replicating current hardcoded hero automatically)
4. Homepage will immediately use new system with no visual changes (unless you update a template)

The original hardcoded hero is preserved in `NewCentreAndCarousel.astro` as fallback, so if anything goes wrong with the template system, the page will still render correctly.
