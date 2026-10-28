/** サイト全体の基本情報 */
export const SITE = {
  name: '鈴音神楽',
  reading: 'すずねかぐら',
  description:
    'マビノギモバイル トゥガルドアイルサーバーのギルド「鈴音神楽」の非公式ファンサイト。ギルドの紹介と、メンバーで集めた攻略情報をまとめています。',
  server: 'トゥガルドアイル',
  xUrl: '', // ギルドのXアカウントができたらURLを入れる
  /** Googleアナリティクスの測定ID（G-から始まる）。空欄なら計測タグを出さない */
  gaId: '',
  /** Search Consoleの確認コード（HTMLタグの content="…" の中身）。空欄なら出さない */
  gscVerification: '',
};

/**
 * サイトマップに載せないページ（noindex のページなど）。
 * BASE_URL を付けない形で書く
 */
export const SITEMAP_EXCLUDE = ['/aikotoba/'];

/**
 * 記事のカテゴリー。増やすときはここに足すだけでOK
 * （記事の category にはここにある名前しか使えません）
 */
export const CATEGORIES = ['ギルド日記', '攻略', 'ビルド', '艦船', '生活スキル'] as const;
export type Category = (typeof CATEGORIES)[number];

/** カテゴリーページのURL（半角英字）。カテゴリーを足したらここにも足す */
export const CATEGORY_SLUGS: Record<Category, string> = {
  ギルド日記: 'diary',
  攻略: 'guide',
  ビルド: 'build',
  艦船: 'ship',
  生活スキル: 'life',
};

export function categoryHref(category: Category): string {
  return href(`/articles/category/${CATEGORY_SLUGS[category]}/`);
}

/** BASE_URL を付けたサイト内リンクを作る */
export function href(path = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

/** 2026年10月28日 の形で日付を表示する */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Tokyo',
  }).format(date);
}
