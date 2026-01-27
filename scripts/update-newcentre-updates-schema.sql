-- Migration: Update oiac_newcentre_updates table
-- This migration allows updates to have BOTH images AND videos, plus article links

-- Step 1: Remove the media_type constraint and make it nullable
-- (keeping the column for backward compatibility, but it's now optional)
ALTER TABLE oiac_newcentre_updates
  DROP CONSTRAINT IF EXISTS oiac_newcentre_updates_media_type_check;

-- Make media_type nullable (it's no longer required since we can have any combination)
ALTER TABLE oiac_newcentre_updates
  ALTER COLUMN media_type DROP NOT NULL;

-- Step 2: Add links column for articles/external URLs
-- Format: [{url: "https://...", title: "Article Title", description: "Optional description"}]
ALTER TABLE oiac_newcentre_updates
  ADD COLUMN IF NOT EXISTS links JSONB DEFAULT '[]'::jsonb;

-- Step 3: Create index for links if needed
CREATE INDEX IF NOT EXISTS idx_newcentre_updates_links ON oiac_newcentre_updates USING GIN (links);

-- Verify the changes
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'oiac_newcentre_updates';
