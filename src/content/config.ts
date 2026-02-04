import { defineCollection, z } from 'astro:content';

// Jobs Collection
const jobs = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    postedDate: z.string(),
    description: z.string().optional(),
    requireAlbertaCertification: z.boolean().optional().nullable(),
    active: z.boolean().default(true),
  }),
});

// Staff Collection
const staff = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    title: z.string().optional().nullable(),
    displayOrder: z.number().optional().nullable(),
    profilePicture: z.object({
      url: z.string(),
    }).optional().nullable(),
    staffType: z.string(), // Will store the type name directly
    description: z.string().optional().nullable(),
  }),
});

// Prayer Times Collection
const prayerTimes = defineCollection({
  type: 'data',
  schema: z.object({
    month: z.number(),
    day: z.number(),
    fajrBegins: z.string(),
    fajrJamah: z.string(),
    sunrise: z.string(),
    zuhrBegins: z.string(),
    zuhrJamah: z.string(),
    asrBegins: z.string(),
    asrJamah: z.string(),
    maghribBegins: z.string(),
    maghribJamah: z.string(),
    ishaBegins: z.string(),
    ishaJamah: z.string(),
  }),
});

// Jummah Times Collection
const jummahTimes = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    time: z.string(),
    order: z.number().optional(),
  }),
});

export const collections = {
  jobs,
  staff,
  'prayer-times': prayerTimes,
  'jummah-times': jummahTimes,
};
