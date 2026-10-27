import { defineConfig } from 'astro/config';

// GitHub Pages（https://mikotorei.github.io/suzune-kagura/）で公開するための設定
// 独自ドメインにするときは site を新しいURLに、base を '/' に変える
export default defineConfig({
  site: 'https://mikotorei.github.io',
  base: '/suzune-kagura',
  trailingSlash: 'ignore',
});
