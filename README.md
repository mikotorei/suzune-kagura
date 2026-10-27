# 鈴音神楽 ギルドサイト

マビノギモバイル トゥガルドアイルサーバーのギルド「鈴音神楽」の非公式ファンサイトです。

公開URL：https://mikotorei.github.io/suzune-kagura/

`main` ブランチが更新されると、GitHub Actions が自動でサイトを作り直して公開します（数分かかります）。

---

## 記事を書く

### スマホ・ブラウザから書く
1. GitHubでこのリポジトリを開き、`src/content/articles/` フォルダに移動
2. `_template.md` を開いて中身を全部コピー
3. フォルダに戻って「Add file」→「Create new file」
4. ファイル名を付ける（例：`2026-11-01-abyss-hard.md`）
   - 頭に `_` を付けない（`_` で始まるファイルは記事にならない）
   - 半角英数字とハイフンがおすすめ。これが記事のURLになる
5. コピーした内容を貼り付けて、タイトルや本文を書き換える
6. 「Commit changes」で保存 → 数分後に公開

書き終わるまで公開したくないときは `draft: true` のままにしておき、公開するときに `false` にします。

### カテゴリー
ギルド日記／攻略／ビルド／艦船／生活スキル

増やしたいときは `src/consts.ts` の `CATEGORIES` と `CATEGORY_SLUGS` に足します。

### 記事を書くときの決まり
- 公式サイトの文章や画像をそのまま貼らない（自分たちの言葉で書く）
- ゲームの画像や公式の文章をAIに読み込ませて記事を作らない（ネクソンの著作物利用ガイドラインで禁止）
- メンバーから聞いた情報を載せるときは、ひとこと了承をもらう
- コラボキャラクターの画像は使わない

### 画像を入れる
`public/images/articles/` に画像を置き、本文に `![説明](/suzune-kagura/images/articles/ファイル名.jpg)` と書きます。

---

## 合言葉を設定する（PCで）

```bash
npm install        # 初回だけ
npm run invite
```

Discordの招待リンクと合言葉を聞かれるので入力します。合言葉でリンクを暗号化して `src/data/invite.json` に保存します（合言葉もリンクも平文では残りません）。

保存したらGitHubに反映し、**ゲーム内のギルド告知の合言葉も同じものに変えて**ください。

- 合言葉は、ひらがな／カタカナ、全角／半角、前後の空白の違いを区別しません
- 合言葉が外に漏れたら、Discordで招待リンクを作り直して `npm run invite` をやり直すだけで切り替わります
- 招待リンクは「有効期限：無期限」で作っておくと、切れて使えなくなることがありません

---

## 手元で表示を確認する（PCで）

```bash
npm install
npm run dev
```

表示された `http://localhost:4321/suzune-kagura/` をブラウザで開きます。

---

## ファイルの場所

| 変えたいもの | ファイル |
| --- | --- |
| トップページ | `src/pages/index.astro` |
| ギルドについて（約束・お願い） | `src/pages/about.astro` |
| 参加方法 | `src/pages/join.astro` |
| 配色・文字 | `src/styles/global.css` |
| ヘッダー・フッター | `src/layouts/Base.astro` |
| サーバー名などの基本情報 | `src/consts.ts` |
| ギルドのアイコン | `public/images/emblem.webp`（ほか `favicon.png` など） |

---

当サイトは非公式のファンサイトです。株式会社ネクソンおよび公式とは関係ありません。
