import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = 'public/images/uploads';

// GET: List all uploaded media files
export const GET: APIRoute = async () => {
  try {
    const uploadPath = path.join(process.cwd(), UPLOAD_DIR);

    // Ensure directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    const files = fs.readdirSync(uploadPath);
    const mediaFiles = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.mp4', '.webm', '.mov'].includes(ext);
      })
      .map(file => {
        const filePath = path.join(uploadPath, file);
        const stats = fs.statSync(filePath);
        const ext = path.extname(file).toLowerCase();
        const isVideo = ['.mp4', '.webm', '.mov'].includes(ext);

        return {
          name: file,
          url: `/images/uploads/${file}`,
          type: isVideo ? 'video' : 'image',
          size: stats.size,
          modified: stats.mtime.toISOString(),
        };
      })
      .sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime());

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

// POST: Upload a new media file
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
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'video/mp4', 'video/webm', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
      return new Response(JSON.stringify({ error: 'Invalid file type. Allowed: JPG, PNG, GIF, WebP, SVG, MP4, WebM, MOV' }), {
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

    const uploadPath = path.join(process.cwd(), UPLOAD_DIR);

    // Ensure directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    // Write file
    const filePath = path.join(uploadPath, fileName);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    const isVideo = file.type.startsWith('video/');
    const url = `/images/uploads/${fileName}`;

    return new Response(JSON.stringify({
      success: true,
      url,
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

// DELETE: Delete a media file
export const DELETE: APIRoute = async ({ request }) => {
  try {
    const { fileName } = await request.json();

    if (!fileName) {
      return new Response(JSON.stringify({ error: 'No fileName provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Prevent directory traversal
    const safeName = path.basename(fileName);
    const filePath = path.join(process.cwd(), UPLOAD_DIR, safeName);

    if (!fs.existsSync(filePath)) {
      return new Response(JSON.stringify({ error: 'File not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    fs.unlinkSync(filePath);

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
