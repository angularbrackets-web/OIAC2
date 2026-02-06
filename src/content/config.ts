import { defineCollection, z } from 'astro:content';

// Posts Collection (still git-based)
const posts = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    image: z.array(z.object({ url: z.string() })),
    link: z.object({
      text: z.string(),
      url: z.string(),
    }),
    content: z.array(z.string()).default([]),
    priority: z.number().optional(),
  }),
});

export const collections = {
  posts,
};
