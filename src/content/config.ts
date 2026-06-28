import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.union([z.string(), z.date()]).transform(d =>
      d instanceof Date ? d.toISOString().slice(0, 10) : d
    ),
    tags: z.array(z.string()).optional().default([]),
    excerpt: z.string().optional().default(''),
    icon: z.enum(['database', 'terminal', 'gauge', 'camera', 'code', 'book', 'pen', 'rss']).optional().default('code'),
    draft: z.boolean().optional().default(false),
    // legacy fields — ignored
    description: z.string().optional(),
  }),
});

export const collections = { blog };
