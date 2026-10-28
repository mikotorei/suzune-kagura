import type { APIRoute } from 'astro';
import { CATEGORIES, CATEGORY_SLUGS, SITEMAP_EXCLUDE, href } from '../consts';
import { getPublishedArticles } from '../lib/articles';

/**
 * Search Console に送るサイトマップ（/suzune-kagura/sitemap.xml）。
 * 記事やカテゴリーは自動で載る。固定ページを増やしたら pages に足す
 */
export const GET: APIRoute = async ({ site }) => {
  const pages = ['/', '/about/', '/join/', '/aikotoba/', '/articles/'];
  const articles = await getPublishedArticles();

  const entries: { path: string; lastmod?: Date }[] = [
    ...pages.map((path) => ({ path })),
    ...CATEGORIES.map((category) => ({ path: `/articles/category/${CATEGORY_SLUGS[category]}/` })),
    ...articles.map((article) => ({ path: `/articles/${article.id}/`, lastmod: article.data.date })),
  ].filter((entry) => !SITEMAP_EXCLUDE.includes(entry.path));

  const urls = entries
    .map(({ path, lastmod }) => {
      const loc = new URL(href(path), site).href;
      const lastmodTag = lastmod ? `<lastmod>${lastmod.toISOString().slice(0, 10)}</lastmod>` : '';
      return `  <url><loc>${loc}</loc>${lastmodTag}</url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
