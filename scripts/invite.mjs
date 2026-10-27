// 合言葉とDiscordの招待リンクを設定するスクリプト
// 使い方：npm run invite
// 入力した合言葉でリンクを暗号化して src/data/invite.json に保存します。
// 合言葉もリンクもファイルには平文で残りません。

import { writeFile } from 'node:fs/promises';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { decryptInvite, encryptInvite, normalizePassphrase } from '../src/lib/aikotoba.ts';

const OUTPUT = new URL('../src/data/invite.json', import.meta.url);
const INVITE_PATTERN = /^https:\/\/(discord\.gg|discord\.com\/invite)\/[\w-]+\/?$/;

const rl = createInterface({ input, output });

try {
  console.log('合言葉ページの設定をします。\n');

  const url = (await rl.question('Discordの招待リンク（https://discord.gg/... ）：')).trim();
  if (!INVITE_PATTERN.test(url)) {
    console.error('\n招待リンクの形が正しくありません。https://discord.gg/ で始まるリンクを貼り付けてください。');
    process.exit(1);
  }

  const passphrase = await rl.question('合言葉：');
  if (normalizePassphrase(passphrase).length < 4) {
    console.error('\n合言葉は4文字以上にしてください（短いと当てられやすくなります）。');
    process.exit(1);
  }

  const confirm = await rl.question('確認のため、もう一度合言葉を入力：');
  if (normalizePassphrase(confirm) !== normalizePassphrase(passphrase)) {
    console.error('\n合言葉が一致しませんでした。もう一度やり直してください。');
    process.exit(1);
  }

  const invite = await encryptInvite(passphrase, url);

  // 念のため、同じ合言葉で戻せるか確認してから保存する
  if ((await decryptInvite(passphrase, invite)) !== url) {
    console.error('\n暗号化の確認に失敗しました。保存せずに終了します。');
    process.exit(1);
  }

  await writeFile(OUTPUT, `${JSON.stringify(invite, null, 2)}\n`);
  console.log('\n保存しました（src/data/invite.json）。');
  console.log('GitHubに反映すると、数分後に合言葉ページが新しい合言葉で使えるようになります。');
  console.log('ゲーム内のギルド告知の合言葉も忘れずに変えてください。');
} finally {
  rl.close();
}
