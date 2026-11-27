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

/**
 * 写真館の写真（src/content/photos/*.yaml）。1枚につき1ファイル。
 * room を書いた写真が「展示品」で、専用の展示室ができる。
 * 画像は public/images/photos/<image>-full.webp と <image>-thumb.webp（scripts/photo.py で作る）
 */
const photos = defineCollection({
  loader: glob({ pattern: '**/[^_]*.yaml', base: './src/content/photos' }),
  schema: z.object({
    /** 提供された日 */
    date: z.coerce.date(),
    /** 画像のファイル名（-full / -thumb の前まで） */
    image: z.string(),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    /** 写真の説明（読み上げ用）。中身を書けないときは「メンバーのスクリーンショット」 */
    alt: z.string().default('鈴音神楽のメンバーのスクリーンショット'),
    /** 展示室の番号。展示品だけ書く */
    room: z.number().int().positive().optional(),
    /** ひとこと（展示品） */
    comment: z.string().optional(),
    /** 展示室に出す提供者の名前。書かなければ名前なし */
    name: z.string().optional(),
    /** 本人が希望したときだけ。x.com のアカウントのアドレスに限る */
    x: z
      .string()
      .regex(/^https:\/\/(x|twitter)\.com\/[A-Za-z0-9_]{1,15}\/?$/, 'x.com のアカウントのアドレスだけ書けます')
      .optional(),
    /** テスト用の写真。PHOTO_TEST=1 で動かしたときだけ出す */
    test: z.boolean().default(false),
  }),
});

export const collections = { articles, photos };
