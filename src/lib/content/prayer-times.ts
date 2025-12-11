import { getCollection } from 'astro:content';

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
  const now = new Date();
  const month = now.getMonth() + 1; // JavaScript months are 0-indexed
  const day = now.getDate();

  const prayerTimes = await getCollection('prayer-times');
  const todayPrayerTime = prayerTimes.find(
    pt => pt.data.month === month && pt.data.day === day
  );

  if (!todayPrayerTime) return undefined;

  return {
    id: todayPrayerTime.id,
    ...todayPrayerTime.data,
  };
}

export async function getPrayerTimesForCurrentMonth(): Promise<PrayerTime[]> {
  const now = new Date();
  const month = now.getMonth() + 1;

  const prayerTimes = await getCollection('prayer-times', (entry) => {
    return entry.data.month === month;
  });

  // Sort by day
  const sortedPrayerTimes = prayerTimes.sort((a, b) => a.data.day - b.data.day);

  return sortedPrayerTimes.map(pt => ({
    id: pt.id,
    ...pt.data,
  }));
}

export async function getJummahTimes(): Promise<JummahTime[]> {
  const jummahTimes = await getCollection('jummah-times');

  // Sort by order if available
  const sortedJummahTimes = jummahTimes.sort((a, b) => {
    const orderA = a.data.order ?? 999;
    const orderB = b.data.order ?? 999;
    return orderA - orderB;
  });

  return sortedJummahTimes.map(jt => ({
    name: jt.data.name,
    time: jt.data.time,
  }));
}
