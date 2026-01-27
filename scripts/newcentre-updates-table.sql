-- New Centre Updates Table
-- Run this SQL in your Supabase SQL Editor to create the table

CREATE TABLE oiac_newcentre_updates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('images', 'video')),
  images JSONB DEFAULT '[]'::jsonb,
  video_url TEXT,
  display_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for ordering
CREATE INDEX idx_newcentre_updates_display_order ON oiac_newcentre_updates(display_order);
CREATE INDEX idx_newcentre_updates_date ON oiac_newcentre_updates(date DESC);

-- Enable Row Level Security
ALTER TABLE oiac_newcentre_updates ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Enable read access for all users" ON oiac_newcentre_updates FOR SELECT USING (true);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_oiac_newcentre_updates_updated_at
  BEFORE UPDATE ON oiac_newcentre_updates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Note: If the update_updated_at_column function doesn't exist, create it first:
-- CREATE OR REPLACE FUNCTION update_updated_at_column()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     NEW.updated_at = NOW();
--     RETURN NEW;
-- END;
-- $$ language 'plpgsql';

-- Insert existing data (the 4 current updates from the page)
INSERT INTO oiac_newcentre_updates (title, date, media_type, video_url, display_order) VALUES
(
  'Southside Islamic School Design & Construction Presentation | Community Event',
  '2024-10-23',
  'video',
  'https://www.youtube-nocookie.com/embed/osecI-VKmiE?si=U7C3jhT1KVINsBub',
  1
),
(
  'New Centre Preview',
  '2024-03-30',
  'video',
  'https://streamable.com/e/0kktoh?loop=0',
  2
),
(
  'Soil Testing done',
  '2024-03-28',
  'video',
  'https://streamable.com/e/1p3zlg?loop=0',
  3
),
(
  'Announcement Video',
  '2024-03-22',
  'video',
  'https://streamable.com/e/z9cu1p?loop=0',
  4
);
