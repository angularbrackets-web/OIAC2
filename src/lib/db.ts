import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// Environment variables will be provided via Vercel
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
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

// Initialize database tables (run this once via Supabase SQL Editor)
// This function is not needed when using Supabase JS client
// Create tables directly in Supabase dashboard or SQL Editor
export async function initDatabase() {
  console.log('For Supabase, please create tables using the SQL Editor in your Supabase dashboard.');
  console.log('See MIGRATION_SUMMARY.md for the SQL commands.');
}
