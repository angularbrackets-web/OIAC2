import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// Environment variables will be provided via Vercel
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

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
export type NewCentreUpdateInput = {
  title: string;
  description?: string;
  date: string;
  mediaType: 'images' | 'video';
  images?: Array<{ url: string }>;
  videoUrl?: string;
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
      media_type: data.mediaType,
      images: data.images || [],
      video_url: data.videoUrl || null,
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
    .order('display_order', { ascending: true, nullsFirst: false })
    .order('date', { ascending: false });

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

// Initialize database tables (run this once via Supabase SQL Editor)
// This function is not needed when using Supabase JS client
// Create tables directly in Supabase dashboard or SQL Editor
export async function initDatabase() {
  console.log('For Supabase, please create tables using the SQL Editor in your Supabase dashboard.');
  console.log('See MIGRATION_SUMMARY.md for the SQL commands.');
}
