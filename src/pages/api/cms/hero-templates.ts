import type { APIRoute } from 'astro';
import {
  createHeroTemplate,
  getHeroTemplates,
  getHeroTemplateById,
  getActiveHeroTemplate,
  updateHeroTemplate,
  deleteHeroTemplate,
  type HeroTemplateInput
} from '../../../lib/db';

export const GET: APIRoute = async ({ url }) => {
  try {
    const id = url.searchParams.get('id');
    const active = url.searchParams.get('active');

    // Get active template
    if (active === 'true') {
      const item = await getActiveHeroTemplate();
      if (!item) {
        return new Response(JSON.stringify({ error: 'No active hero template found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return new Response(JSON.stringify(item), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get single template by id
    if (id) {
      const item = await getHeroTemplateById(id);
      if (!item) {
        return new Response(JSON.stringify({ error: 'Not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return new Response(JSON.stringify(item), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get all templates
    const items = await getHeroTemplates();
    return new Response(JSON.stringify(items), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching hero templates:', error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const data: HeroTemplateInput = await request.json();

    // Validate required fields
    if (!data.title || !data.badge || !data.backgroundType || !data.ctaText || !data.ctaLink) {
      return new Response(JSON.stringify({
        error: 'Missing required fields: title, badge, backgroundType, ctaText, ctaLink'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate backgroundType
    if (!['color', 'image'].includes(data.backgroundType)) {
      return new Response(JSON.stringify({
        error: 'backgroundType must be either "color" or "image"'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate background is provided for the selected type
    if (data.backgroundType === 'color' && !data.backgroundColor) {
      return new Response(JSON.stringify({
        error: 'backgroundColor is required when backgroundType is "color"'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (data.backgroundType === 'image' && !data.backgroundImageUrl) {
      return new Response(JSON.stringify({
        error: 'backgroundImageUrl is required when backgroundType is "image"'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await createHeroTemplate(data);

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating hero template:', error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate backgroundType if being changed
    if (data.backgroundType && !['color', 'image'].includes(data.backgroundType)) {
      return new Response(JSON.stringify({
        error: 'backgroundType must be either "color" or "image"'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await updateHeroTemplate(id, data);

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating hero template:', error);
    const errorMsg = String(error);
    const status = errorMsg.includes('Cannot delete') ? 400 : 500;
    return new Response(JSON.stringify({ error: errorMsg }), {
      status,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const { id } = await request.json();

    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await deleteHeroTemplate(id);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting hero template:', error);
    const errorMsg = String(error);
    // If error mentions active template, return 400, otherwise 500
    const status = errorMsg.includes('Cannot delete') ? 400 : 500;
    return new Response(JSON.stringify({ error: errorMsg }), {
      status,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
