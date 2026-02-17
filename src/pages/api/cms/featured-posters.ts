import type { APIRoute } from 'astro';
import {
  createFeaturedPoster,
  getFeaturedPosters,
  getFeaturedPosterById,
  updateFeaturedPoster,
  deleteFeaturedPoster,
  shiftFeaturedPosterOrders,
  type FeaturedPosterInput
} from '../../../lib/db';

export const GET: APIRoute = async ({ url }) => {
  try {
    const id = url.searchParams.get('id');

    if (id) {
      const item = await getFeaturedPosterById(id);
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

    const items = await getFeaturedPosters();
    return new Response(JSON.stringify(items), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching featured posters:', error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const data: FeaturedPosterInput = await request.json();

    if (!data.title || !data.imageUrl) {
      return new Response(JSON.stringify({ error: 'Missing required fields: title, imageUrl' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (data.displayOrder == null) {
      await shiftFeaturedPosterOrders();
      data.displayOrder = 1;
    }

    const result = await createFeaturedPoster(data);

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating featured poster:', error);
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

    const result = await updateFeaturedPoster(id, data);

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating featured poster:', error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
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

    await deleteFeaturedPoster(id);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting featured poster:', error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
