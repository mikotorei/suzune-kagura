import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORIES } from './consts';

const articles = defineCollection({
  // 「_」で始まるファイル（ひな形など）は記事として扱わない
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.enum(CATEGORIES),
    author: z.string().default('鈴音神楽'),
    description: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles };
