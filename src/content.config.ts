import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORIES } from './consts';

const articles = defineCollection({
  // 「_」で始まるファイル（ひな形など）は記事として扱わない
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    /** 記事を公開した日 */
    date: z.coerce.date(),
    /** 出来事があった日（後から書くとき用）。書かなければ公開日と同じ扱い */
    eventDate: z.coerce.date().optional(),
    category: z.enum(CATEGORIES),
    author: z.string().default('鈴音神楽'),
    description: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles };
