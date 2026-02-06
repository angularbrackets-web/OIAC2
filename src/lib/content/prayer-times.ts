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
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();

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
}

export async function getPrayerTimesForCurrentMonth(): Promise<PrayerTime[]> {
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
}

export async function getJummahTimes(): Promise<JummahTime[]> {
  const records = await getJummahTimesFromDB();

  return records.map(jt => ({
    name: jt.name,
    time: jt.time,
  }));
}
