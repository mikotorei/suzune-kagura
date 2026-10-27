/**
 * 合言葉でDiscordの招待リンクを暗号化・復号する処理。
 * scripts/invite.mjs（暗号化）とブラウザ（復号）で同じ手順を使う。
 *
 * 合言葉 → PBKDF2(SHA-256) で鍵を作る → AES-GCM で暗号化
 * サイトには暗号化したものしか置かないので、ページのソースを見てもリンクは分からない。
 */

export interface InviteData {
  /** 暗号化に使ったランダムな値（Base64） */
  salt: string;
  iv: string;
  /** 暗号化した招待リンク（Base64） */
  data: string;
  iterations: number;
  updatedAt: string;
}

/** 全角・半角、ひらがな・カタカナ、前後の空白、大文字小文字の違いを吸収する */
export function normalizePassphrase(input: string): string {
  return input
    .normalize('NFKC')
    .trim()
    .toLowerCase()
    .replace(/[\u30a1-\u30f6]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
}

export function toBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

export function fromBase64(text: string): Uint8Array<ArrayBuffer> {
  const binary = atob(text);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function deriveKey(passphrase: string, salt: Uint8Array<ArrayBuffer>, iterations: number) {
  const material = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(normalizePassphrase(passphrase)),
    'PBKDF2',
    false,
    ['deriveKey'],
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

export async function encryptInvite(
  passphrase: string,
  url: string,
  iterations = 310_000,
): Promise<InviteData> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt, iterations);
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(url));
  return {
    salt: toBase64(salt),
    iv: toBase64(iv),
    data: toBase64(new Uint8Array(encrypted)),
    iterations,
    updatedAt: new Date().toISOString(),
  };
}

/** 合言葉が違うときは null を返す */
export async function decryptInvite(passphrase: string, invite: InviteData): Promise<string | null> {
  try {
    const key = await deriveKey(passphrase, fromBase64(invite.salt), invite.iterations);
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: fromBase64(invite.iv) },
      key,
      fromBase64(invite.data),
    );
    return new TextDecoder().decode(decrypted);
  } catch {
    return null;
  }
}
