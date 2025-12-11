import type { APIRoute } from 'astro';
import { createUtmHit } from '../../../lib/db';

const allowedSources = [
  'facebook',
  'instagram',
  'youtube',
  'email',
  'whatsapp',
  'other',
] as const;

type AllowedSource = typeof allowedSources[number];

type TrackPayload = {
  source: string;
  timestamp: string;
  donateButtonClicked?: boolean;
};

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const source = url.searchParams.get('source') || 'other';
    const timestamp = url.searchParams.get('ts') || new Date().toISOString();
    const donateButtonClicked = true; // GET requests from image pings are always for donations

    // Map invalid sources to 'other' instead of failing
    const validSource = allowedSources.includes((source || '').toLowerCase() as AllowedSource)
      ? (source || '').toLowerCase()
      : 'other';

    // Create UTM hit record
    const result = await createUtmHit({
      source: validSource,
      timestamp: new Date(timestamp),
      donateButtonClicked,
    });

    console.log('Created UTM hit (GET) with source:', validSource, 'timestamp:', timestamp, 'donate:', donateButtonClicked);

    return new Response(
      JSON.stringify({ status: 'success', utmId: result[0].id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('UtmHit tracking error (GET):', error);
    return new Response(
      JSON.stringify({ status: 'error', message: 'Failed to track visit' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { source, timestamp, donateButtonClicked = false } = body as TrackPayload;

    // Map invalid sources to 'other' instead of failing
    const validSource = allowedSources.includes((source || '').toLowerCase() as AllowedSource)
      ? (source || '').toLowerCase()
      : 'other';

    // Create UTM hit record
    const result = await createUtmHit({
      source: validSource,
      timestamp: new Date(timestamp),
      donateButtonClicked,
    });

    console.log('Created UTM hit (POST) with source:', validSource, 'timestamp:', timestamp, 'donate:', donateButtonClicked);

    return new Response(
      JSON.stringify({ status: 'success', utmId: result[0].id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('UtmHit tracking error (POST):', error);
    return new Response(
      JSON.stringify({ status: 'error', message: 'Failed to track visit' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
