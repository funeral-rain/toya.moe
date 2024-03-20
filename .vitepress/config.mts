import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Funeral Rain's Blog",
  description: "This blog is for Fuyutsuki Toya, an \"arrogant little girl\"",
  base: '/',
  srcDir: 'articles',
  outDir: './dist',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Fuyutsuki Toya', link: '/toya-kawaii/toya' },
      { text: 'Home', link: '/' },
    ],

    sidebar: [
      {
        text: 'Toya Kawaii !!',
        items: [
          { text: 'Fuyutsuki Toya', link: '/toya-kawaii/toya' },
        ],
      },
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/funeral-rain/toya.moe' },
    ],
  },
})
