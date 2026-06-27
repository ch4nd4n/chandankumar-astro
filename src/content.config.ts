import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).optional().default([]),
    excerpt: z.string().optional(),
    icon: z.enum(['database', 'terminal', 'gauge', 'camera', 'code', 'book', 'pen', 'rss']).optional(),
    draft: z.boolean().optional().default(false),
    // legacy Gatsby fields — accepted but ignored
    slug: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const collections = { blog };
