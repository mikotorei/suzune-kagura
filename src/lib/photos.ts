import { getCollection, type CollectionEntry } from 'astro:content';
import { href } from '../consts';

export type Photo = CollectionEntry<'photos'>;

/** テスト用の写真を出すか（PHOTO_TEST=1 npm run dev のときだけ） */
const SHOW_TEST = import.meta.env.PHOTO_TEST === '1';

/** 写真館の写真すべて（新しく届いた順） */
export async function getPhotos(): Promise<Photo[]> {
  const photos = await getCollection('photos', ({ data }) => SHOW_TEST || !data.test);
  return photos.sort((a, b) => b.data.date.getTime() - a.data.date.getTime() || b.id.localeCompare(a.id));
}

/** 展示品だけ（展示室の番号順） */
export async function getExhibits(): Promise<Photo[]> {
  return (await getPhotos()).filter((photo) => photo.data.room).sort((a, b) => a.data.room! - b.data.room!);
}

export const thumbOf = (photo: Photo) => href(`/images/photos/${photo.data.image}-thumb.webp`);
export const fullOf = (photo: Photo) => href(`/images/photos/${photo.data.image}-full.webp`);
export const roomPath = (room: number) => `/gallery/${room}/`;

const DIGITS = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
/** 1〜9999 を漢数字に（12 → 十二、105 → 百五） */
export function kanjiNumber(n: number): string {
  if (n <= 0) return '〇';
  const units = [
    [1000, '千'],
    [100, '百'],
    [10, '十'],
  ] as const;
  let rest = n;
  let out = '';
  for (const [size, mark] of units) {
    const d = Math.floor(rest / size);
    if (d) out += (d === 1 ? '' : DIGITS[d]) + mark;
    rest %= size;
  }
  return out + DIGITS[rest];
}

/** 「第一展示室」 */
export const roomName = (room: number) => `第${kanjiNumber(room)}展示室`;
