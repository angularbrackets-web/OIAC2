-- Hero Templates Table Migration
-- Run this in Supabase SQL Editor to create the hero_templates table

-- Create hero_templates table
CREATE TABLE IF NOT EXISTS hero_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  badge TEXT NOT NULL,
  subtitle TEXT,
  background_type TEXT NOT NULL CHECK (background_type IN ('color', 'image')),
  background_color TEXT,
  background_image_url TEXT,
  video_url TEXT,
  video_type TEXT CHECK (video_type IN ('youtube', 'streamable', 'other') OR video_type IS NULL),
  cta_text TEXT NOT NULL,
  cta_link TEXT NOT NULL,
  is_active BOOLEAN DEFAULT FALSE,
  display_order INTEGER,
  full_width BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for is_active for faster queries
CREATE INDEX IF NOT EXISTS idx_hero_templates_is_active ON hero_templates(is_active);

-- Create index for display_order for sorting
CREATE INDEX IF NOT EXISTS idx_hero_templates_display_order ON hero_templates(display_order);

-- Add video columns to existing table (if upgrading from earlier version)
ALTER TABLE hero_templates
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS video_type TEXT CHECK (video_type IN ('youtube', 'streamable', 'other') OR video_type IS NULL),
ADD COLUMN IF NOT EXISTS full_width BOOLEAN DEFAULT FALSE;

-- Seed initial hero template with current hardcoded values
INSERT INTO hero_templates (
  title,
  badge,
  subtitle,
  background_type,
  background_color,
  background_image_url,
  cta_text,
  cta_link,
  is_active,
  display_order
) VALUES (
  'New Omar Ibn Al Khattab Centre',
  'UPCOMING PROJECT',
  'A beacon of progress and possibility. This purpose-built facility will be more than just a building. It will be a hub of activity.',
  'color',
  '#C84C3C',
  NULL,
  'Donate Now',
  '/donatetonewcentre',
  TRUE,
  1
);

-- Note: After running this SQL, the hero templating system will be active
-- Visit /admin/hero-templates to manage templates
-- The homepage will automatically use the active template
