import { getCollection } from 'astro:content';

import type { CollectionEntry } from 'astro:content';

/** 記事の「出来事の日」。書いていなければ公開日 */
export function eventDateOf(article: CollectionEntry<'articles'>): Date {
  return article.data.eventDate ?? article.data.date;
}

/** 公開中の記事を、出来事の日が新しい順に取り出す（draft: true の記事は除く） */
export async function getPublishedArticles() {
  const articles = await getCollection('articles', ({ data }) => !data.draft);
  return articles.sort((a, b) => eventDateOf(b).getTime() - eventDateOf(a).getTime());
}
