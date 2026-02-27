import { getJummahTimesFromDB, getPrayerTimeByDay, getPrayerTimesByMonth } from '../db';

export type PrayerTime = {
  id: string;
  month: number;
  day: number;
  fajrBegins: string;
  fajrJamah: string;
  sunrise: string;
  zuhrBegins: string;
  zuhrJamah: string;
  asrBegins: string;
  asrJamah: string;
  maghribBegins: string;
  maghribJamah: string;
  ishaBegins: string;
  ishaJamah: string;
};

export type JummahTime = {
  name: string;
  time: string;
};

export async function getPrayerTimesForCurrentDay(): Promise<PrayerTime | undefined> {
  try {
    // Use Edmonton's local timezone to get the correct date.
    // The server runs in UTC, so using `new Date()` directly would return
    // the wrong date for Edmonton users after ~5–7pm MST/MDT.
    const now = new Date();
    const edmontonDateStr = now.toLocaleDateString('en-CA', { timeZone: 'America/Edmonton' }); // "YYYY-MM-DD"
    const [, monthStr, dayStr] = edmontonDateStr.split('-');
    const month = parseInt(monthStr, 10);
    const day = parseInt(dayStr, 10);

    const record = await getPrayerTimeByDay(month, day);
    if (!record) return undefined;

    return {
      id: record.id,
      month: record.month,
      day: record.day,
      fajrBegins: record.fajrBegins,
      fajrJamah: record.fajrJamah,
      sunrise: record.sunrise,
      zuhrBegins: record.zuhrBegins,
      zuhrJamah: record.zuhrJamah,
      asrBegins: record.asrBegins,
      asrJamah: record.asrJamah,
      maghribBegins: record.maghribBegins,
      maghribJamah: record.maghribJamah,
      ishaBegins: record.ishaBegins,
      ishaJamah: record.ishaJamah,
    };
  } catch (error) {
    console.error('Error fetching prayer times for current day:', error);
    return undefined;
  }
}

export async function getPrayerTimesForCurrentMonth(): Promise<PrayerTime[]> {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;

    const records = await getPrayerTimesByMonth(month);

    return records.map(record => ({
      id: record.id,
      month: record.month,
      day: record.day,
      fajrBegins: record.fajrBegins,
      fajrJamah: record.fajrJamah,
      sunrise: record.sunrise,
      zuhrBegins: record.zuhrBegins,
      zuhrJamah: record.zuhrJamah,
      asrBegins: record.asrBegins,
      asrJamah: record.asrJamah,
      maghribBegins: record.maghribBegins,
      maghribJamah: record.maghribJamah,
      ishaBegins: record.ishaBegins,
      ishaJamah: record.ishaJamah,
    }));
  } catch (error) {
    console.error('Error fetching prayer times for current month:', error);
    return [];
  }
}

export async function getJummahTimes(): Promise<JummahTime[]> {
  try {
    const records = await getJummahTimesFromDB();

    return records.map(jt => ({
      name: jt.name,
      time: jt.time,
    }));
  } catch (error) {
    console.error('Error fetching jummah times:', error);
    return [];
  }
}
