import type { APIRoute } from 'astro';
import {
  createNewCentreUpdate,
  getNewCentreUpdates,
  getNewCentreUpdateById,
  updateNewCentreUpdate,
  deleteNewCentreUpdate,
  type NewCentreUpdateInput
} from '../../../lib/db';

export const GET: APIRoute = async ({ url }) => {
  try {
    const id = url.searchParams.get('id');

    if (id) {
      const update = await getNewCentreUpdateById(id);
      if (!update) {
        return new Response(JSON.stringify({ error: 'Not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return new Response(JSON.stringify(update), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const updates = await getNewCentreUpdates();
    return new Response(JSON.stringify(updates), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching newcentre updates:', error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const data: NewCentreUpdateInput = await request.json();

    // Validate required fields (mediaType is now optional)
    if (!data.title || !data.date) {
      return new Response(JSON.stringify({ error: 'Missing required fields: title, date' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await createNewCentreUpdate(data);

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating newcentre update:', error);
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

    const result = await updateNewCentreUpdate(id, data);

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating newcentre update:', error);
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

    await deleteNewCentreUpdate(id);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting newcentre update:', error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
