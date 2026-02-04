import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// Environment variables will be provided via Vercel or .env file
const supabaseUrl = import.meta.env.SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Volunteers table
export async function createVolunteer(data: {
  name: string;
  email: string;
  phone: string;
  expertise: string;
  message: string;
}) {
  const { data: result, error } = await supabase
    .from('oiac_volunteers')
    .insert([{
      name: data.name,
      email: data.email,
      phone: data.phone,
      expertise: data.expertise,
      message: data.message,
    }])
    .select();

  if (error) {
    throw error;
  }

  return result;
}

export async function getVolunteerByEmail(email: string) {
  const { data, error } = await supabase
    .from('oiac_volunteers')
    .select('*')
    .eq('email', email);

  if (error) {
    throw error;
  }

  return data || [];
}

// UTM Hits table
export async function createUtmHit(data: {
  source: string;
  timestamp: Date;
  donateButtonClicked: boolean;
}) {
  const { data: result, error } = await supabase
    .from('oiac_utm_hits')
    .insert([{
      source: data.source,
      timestamp: data.timestamp.toISOString(),
      donate_button_clicked: data.donateButtonClicked,
    }])
    .select();

  if (error) {
    throw error;
  }

  return result;
}

export async function getUtmHits() {
  const { data, error } = await supabase
    .from('oiac_utm_hits')
    .select('*')
    .order('timestamp', { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
}

// New Centre Updates table
export type NewCentreUpdateLink = {
  url: string;
  title: string;
  description?: string;
};

export type NewCentreUpdateInput = {
  title: string;
  description?: string;
  date: string;
  mediaType?: 'images' | 'video' | 'mixed'; // Now optional, can have any combination
  images?: Array<{ url: string }>;
  videoUrl?: string;
  links?: NewCentreUpdateLink[];
  displayOrder?: number;
};

export type NewCentreUpdateRecord = NewCentreUpdateInput & {
  id: string;
  created_at: string;
  updated_at: string;
};

export async function createNewCentreUpdate(data: NewCentreUpdateInput) {
  const { data: result, error } = await supabase
    .from('oiac_newcentre_updates')
    .insert([{
      title: data.title,
      description: data.description || null,
      date: data.date,
      media_type: data.mediaType || null,
      images: data.images || [],
      video_url: data.videoUrl || null,
      links: data.links || [],
      display_order: data.displayOrder || null,
    }])
    .select();

  if (error) {
    throw error;
  }

  return result;
}

export async function getNewCentreUpdates(): Promise<NewCentreUpdateRecord[]> {
  const { data, error } = await supabase
    .from('oiac_newcentre_updates')
    .select('*')
    .order('date', { ascending: false })
    .order('display_order', { ascending: true, nullsFirst: false });

  if (error) {
    throw error;
  }

  return (data || []).map(record => ({
    id: record.id,
    title: record.title,
    description: record.description,
    date: record.date,
    mediaType: record.media_type,
    images: record.images || [],
    videoUrl: record.video_url,
    links: record.links || [],
    displayOrder: record.display_order,
    created_at: record.created_at,
    updated_at: record.updated_at,
  }));
}

export async function getNewCentreUpdateById(id: string): Promise<NewCentreUpdateRecord | null> {
  const { data, error } = await supabase
    .from('oiac_newcentre_updates')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    date: data.date,
    mediaType: data.media_type,
    images: data.images || [],
    videoUrl: data.video_url,
    links: data.links || [],
    displayOrder: data.display_order,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

export async function updateNewCentreUpdate(id: string, data: Partial<NewCentreUpdateInput>) {
  const updateData: Record<string, unknown> = {};

  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.date !== undefined) updateData.date = data.date;
  if (data.mediaType !== undefined) updateData.media_type = data.mediaType;
  if (data.images !== undefined) updateData.images = data.images;
  if (data.videoUrl !== undefined) updateData.video_url = data.videoUrl;
  if (data.links !== undefined) updateData.links = data.links;
  if (data.displayOrder !== undefined) updateData.display_order = data.displayOrder;

  const { data: result, error } = await supabase
    .from('oiac_newcentre_updates')
    .update(updateData)
    .eq('id', id)
    .select();

  if (error) {
    throw error;
  }

  return result;
}

export async function deleteNewCentreUpdate(id: string) {
  const { error } = await supabase
    .from('oiac_newcentre_updates')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }

  return true;
}

// Slideshow items table
export type SlideshowItemInput = {
  title: string;
  description?: string;
  url: string;
  thumbnail?: string;
  videoType: 'youtube' | 'facebook' | 'other';
  featured?: boolean;
  displayOrder?: number;
};

export type SlideshowItemRecord = SlideshowItemInput & {
  id: string;
  created_at: string;
  updated_at: string;
};

function mapSlideshowRecord(record: Record<string, any>): SlideshowItemRecord {
  return {
    id: record.id,
    title: record.title,
    description: record.description,
    url: record.url,
    thumbnail: record.thumbnail,
    videoType: record.video_type,
    featured: record.featured,
    displayOrder: record.display_order,
    created_at: record.created_at,
    updated_at: record.updated_at,
  };
}

export async function createSlideshowItem(data: SlideshowItemInput): Promise<SlideshowItemRecord[]> {
  const { data: result, error } = await supabase
    .from('oiac_slideshow')
    .insert([{
      title: data.title,
      description: data.description || null,
      url: data.url,
      thumbnail: data.thumbnail || null,
      video_type: data.videoType,
      featured: data.featured ?? false,
      display_order: data.displayOrder || null,
    }])
    .select();

  if (error) throw error;
  return (result || []).map(mapSlideshowRecord);
}

export async function getSlideshowItems(): Promise<SlideshowItemRecord[]> {
  const { data, error } = await supabase
    .from('oiac_slideshow')
    .select('*')
    .order('display_order', { ascending: true, nullsFirst: false });

  if (error) throw error;
  return (data || []).map(mapSlideshowRecord);
}

export async function getSlideshowItemById(id: string): Promise<SlideshowItemRecord | null> {
  const { data, error } = await supabase
    .from('oiac_slideshow')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return mapSlideshowRecord(data);
}

export async function updateSlideshowItem(id: string, data: Partial<SlideshowItemInput>) {
  const updateData: Record<string, unknown> = {};

  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.url !== undefined) updateData.url = data.url;
  if (data.thumbnail !== undefined) updateData.thumbnail = data.thumbnail;
  if (data.videoType !== undefined) updateData.video_type = data.videoType;
  if (data.featured !== undefined) updateData.featured = data.featured;
  if (data.displayOrder !== undefined) updateData.display_order = data.displayOrder;

  const { data: result, error } = await supabase
    .from('oiac_slideshow')
    .update(updateData)
    .eq('id', id)
    .select();

  if (error) throw error;
  return result;
}

export async function deleteSlideshowItem(id: string) {
  const { error } = await supabase
    .from('oiac_slideshow')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

// Posters table
export type PosterInput = {
  title: string;
  imageUrl: string;
  linkText?: string;
  linkUrl?: string;
  displayOrder?: number;
};

export type PosterRecord = PosterInput & {
  id: string;
  created_at: string;
  updated_at: string;
};

function mapPosterRecord(record: Record<string, any>): PosterRecord {
  return {
    id: record.id,
    title: record.title,
    imageUrl: record.image_url,
    linkText: record.link_text,
    linkUrl: record.link_url,
    displayOrder: record.display_order,
    created_at: record.created_at,
    updated_at: record.updated_at,
  };
}

export async function shiftPosterOrders(): Promise<void> {
  const { data, error } = await supabase
    .from('oiac_posters')
    .select('id, display_order');

  if (error) throw error;

  for (const poster of (data || [])) {
    await supabase
      .from('oiac_posters')
      .update({ display_order: (poster.display_order || 0) + 1 })
      .eq('id', poster.id);
  }
}

export async function createPoster(data: PosterInput): Promise<PosterRecord[]> {
  const { data: result, error } = await supabase
    .from('oiac_posters')
    .insert([{
      title: data.title,
      image_url: data.imageUrl,
      link_text: data.linkText || null,
      link_url: data.linkUrl || null,
      display_order: data.displayOrder || null,
    }])
    .select();

  if (error) throw error;
  return (result || []).map(mapPosterRecord);
}

export async function getPosters(): Promise<PosterRecord[]> {
  const { data, error } = await supabase
    .from('oiac_posters')
    .select('*')
    .order('display_order', { ascending: true, nullsFirst: false });

  if (error) throw error;
  return (data || []).map(mapPosterRecord);
}

export async function getPosterById(id: string): Promise<PosterRecord | null> {
  const { data, error } = await supabase
    .from('oiac_posters')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return mapPosterRecord(data);
}

export async function updatePoster(id: string, data: Partial<PosterInput>) {
  const updateData: Record<string, unknown> = {};

  if (data.title !== undefined) updateData.title = data.title;
  if (data.imageUrl !== undefined) updateData.image_url = data.imageUrl;
  if (data.linkText !== undefined) updateData.link_text = data.linkText;
  if (data.linkUrl !== undefined) updateData.link_url = data.linkUrl;
  if (data.displayOrder !== undefined) updateData.display_order = data.displayOrder;

  const { data: result, error } = await supabase
    .from('oiac_posters')
    .update(updateData)
    .eq('id', id)
    .select();

  if (error) throw error;
  return result;
}

export async function deletePoster(id: string) {
  const { error } = await supabase
    .from('oiac_posters')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

// Initialize database tables (run this once via Supabase SQL Editor)
// This function is not needed when using Supabase JS client
// Create tables directly in Supabase dashboard or SQL Editor
export async function initDatabase() {
  console.log('For Supabase, please create tables using the SQL Editor in your Supabase dashboard.');
  console.log('See MIGRATION_SUMMARY.md for the SQL commands.');
}
