import type { APIRoute } from 'astro';
import { bulkUpsertPrayerTimes, type PrayerTimeInput } from '../../../lib/db';
import fs from 'node:fs';
import path from 'node:path';

export const POST: APIRoute = async () => {
  try {
    const contentDir = path.join(process.cwd(), 'src', 'content', 'prayer-times');

    if (!fs.existsSync(contentDir)) {
      return new Response(JSON.stringify({ error: 'Prayer times content directory not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.json'));
    const records: PrayerTimeInput[] = [];

    for (const file of files) {
      try {
        const raw = fs.readFileSync(path.join(contentDir, file), 'utf-8');
        const data = JSON.parse(raw);
        records.push({
          month: data.month,
          day: data.day,
          fajrBegins: data.fajrBegins,
          fajrJamah: data.fajrJamah,
          sunrise: data.sunrise,
          zuhrBegins: data.zuhrBegins,
          zuhrJamah: data.zuhrJamah,
          asrBegins: data.asrBegins,
          asrJamah: data.asrJamah,
          maghribBegins: data.maghribBegins,
          maghribJamah: data.maghribJamah,
          ishaBegins: data.ishaBegins,
          ishaJamah: data.ishaJamah,
        });
      } catch (e) {
        console.error(`Error parsing ${file}:`, e);
      }
    }

    if (records.length === 0) {
      return new Response(JSON.stringify({ error: 'No prayer time records found' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const count = await bulkUpsertPrayerTimes(records);

    return new Response(JSON.stringify({ success: true, count, total: records.length }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error seeding prayer times:', error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
