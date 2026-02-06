import type { APIRoute } from 'astro';
import {
  createPrayerTime,
  getPrayerTimesFromDB,
  getPrayerTimesByMonth,
  getPrayerTimeById,
  updatePrayerTime,
  deletePrayerTime,
  bulkUpsertPrayerTimes,
  type PrayerTimeInput
} from '../../../lib/db';

export const GET: APIRoute = async ({ url }) => {
  try {
    const id = url.searchParams.get('id');
    const month = url.searchParams.get('month');

    if (id) {
      const item = await getPrayerTimeById(id);
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

    if (month) {
      const items = await getPrayerTimesByMonth(parseInt(month));
      return new Response(JSON.stringify(items), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const items = await getPrayerTimesFromDB();
    return new Response(JSON.stringify(items), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request, url }) => {
  try {
    const bulk = url.searchParams.get('bulk');

    if (bulk === 'true') {
      const records: PrayerTimeInput[] = await request.json();
      const count = await bulkUpsertPrayerTimes(records);
      return new Response(JSON.stringify({ success: true, count }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data: PrayerTimeInput = await request.json();

    if (!data.month || !data.day || !data.fajrBegins) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await createPrayerTime(data);

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating prayer time:', error);
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

    const result = await updatePrayerTime(id, data);

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating prayer time:', error);
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

    await deletePrayerTime(id);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting prayer time:', error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
