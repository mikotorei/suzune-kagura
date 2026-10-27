import { getCollection } from 'astro:content';

/** 公開中の記事を新しい順に取り出す（draft: true の記事は除く） */
export async function getPublishedArticles() {
  const articles = await getCollection('articles', ({ data }) => !data.draft);
  return articles.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
