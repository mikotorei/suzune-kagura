/** サイト全体の基本情報 */
export const SITE = {
  name: '鈴音神楽',
  reading: 'すずねかぐら',
  description:
    'マビノギモバイル トゥガルドアイルサーバーのギルド「鈴音神楽」の非公式ファンサイト。ギルドの紹介と、日々の活動の記録を載せています。',
  server: 'トゥガルドアイル',
  xUrl: '', // ギルドのXアカウントができたらURLを入れる
  /** Googleアナリティクスの測定ID（G-から始まる）。空欄なら計測タグを出さない */
  gaId: 'G-TV02QWE34W',
  /** Search Consoleの確認コード（HTMLタグの content="…" の中身）。空欄なら出さない */
  gscVerification: 'oLwgPS7bRYTIy8F3EJxubNONedcQwLjlD8-m6a2NxiY',
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
export const CATEGORIES = ['神楽だより', '巫女のひとりごと'] as const;
export type Category = (typeof CATEGORIES)[number];

/** カテゴリーページのURL（半角英字）。カテゴリーを足したらここにも足す */
export const CATEGORY_SLUGS: Record<Category, string> = {
  神楽だより: 'dayori',
  巫女のひとりごと: 'hitorigoto',
};

/** カテゴリーページの説明文。迷ったら「主語がみんなか、ギルマスか」で分ける */
export const CATEGORY_LEADS: Record<Category, string> = {
  神楽だより: 'みんなで遊んだこと、ギルドのできごとの記録です。',
  巫女のひとりごと: 'ギルマスが整えたことや、伝えたいことを気ままに書いています。',
};

export function categoryHref(category: Category): string {
  return href(`/articles/category/${CATEGORY_SLUGS[category]}/`);
}

/** BASE_URL を付けたサイト内リンクを作る */
export function href(path = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

/** 11月18日 の形（年なし）で日付を表示する */
export function formatMonthDay(date: Date): string {
  return new Intl.DateTimeFormat('ja-JP', { month: 'long', day: 'numeric', timeZone: 'Asia/Tokyo' }).format(date);
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
