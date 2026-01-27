import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/db';

const BUCKET_NAME = 'media';

// GET: List all uploaded media files from Supabase Storage
export const GET: APIRoute = async () => {
  try {
    const { data: files, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list('', {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) {
      console.error('Supabase storage error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const mediaFiles = (files || [])
      .filter(file => file.name !== '.emptyFolderPlaceholder')
      .map(file => {
        const ext = file.name.split('.').pop()?.toLowerCase() || '';
        const isVideo = ['mp4', 'webm', 'mov'].includes(ext);

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(file.name);

        return {
          name: file.name,
          url: publicUrl,
          type: isVideo ? 'video' : 'image',
          size: file.metadata?.size || 0,
          modified: file.created_at || new Date().toISOString(),
        };
      });

    return new Response(JSON.stringify(mediaFiles), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error listing media:', error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// POST: Upload a new media file to Supabase Storage
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

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/avif', 'image/heic', 'image/heif', 'video/mp4', 'video/webm', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
      return new Response(JSON.stringify({ error: 'Invalid file type. Allowed: JPG, PNG, GIF, WebP, AVIF, HEIC, SVG, MP4, WebM, MOV' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create safe filename
    const timestamp = Date.now();
    const safeName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, '_')
      .replace(/_+/g, '_');
    const fileName = `${timestamp}_${safeName}`;

    // Upload to Supabase Storage
    const buffer = await file.arrayBuffer();
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    const isVideo = file.type.startsWith('video/');

    return new Response(JSON.stringify({
      success: true,
      url: publicUrl,
      name: fileName,
      type: isVideo ? 'video' : 'image'
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error uploading media:', error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// DELETE: Delete a media file from Supabase Storage
export const DELETE: APIRoute = async ({ request }) => {
  try {
    const { fileName } = await request.json();

    if (!fileName) {
      return new Response(JSON.stringify({ error: 'No fileName provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Extract just the filename if a full URL was provided
    const name = fileName.includes('/') ? fileName.split('/').pop() : fileName;

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([name]);

    if (error) {
      console.error('Supabase delete error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting media:', error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
