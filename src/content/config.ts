import { defineCollection, z } from 'astro:content';

// Posts Collection (still git-based)
const posts = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    image: z.array(z.object({ url: z.string() })).optional(),
    link: z.object({
      text: z.string(),
      url: z.string(),
    }).optional(),
    content: z.array(z.string()).optional(),
    priority: z.number().optional(),
  }),
});

export const collections = {
  posts,
};
