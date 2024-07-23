import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Funeral Rain's Blog",
  description: "The blog for Toya, kawaii but \"arrogant\" little girl !",
  base: '/',
  srcDir: 'articles',
  outDir: './dist',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Fuyutsuki Toya', link: '/toya-kawaii/toya' },
      { text: 'Technology', link: '/tech/tech ' },
      { text: 'Home', link: '/' },
      { text: 'Friends', link: '/other/friends/index'}
    ],

    sidebar: [
      {
        text: 'Toya Kawaii !!',
        items: [
          { text: 'Fuyutsuki Toya', link: '/toya-kawaii/toya' },
        ],
      },
      {
        text: 'Technology',
        items: [
          { text: '综述', link: '/tech/tech' },
          { text: 'Linux 常用软件的安装与设置笔记集', link: '/tech/command-install-common-software' },
          { text: 'Linux 系统基本功能使用笔记集', link: '/tech/command-use-linux' },
          { text: '系统修复笔记集', link: '/tech/command-repair-system' },
        ]
      },
      {
        text: 'Other',
        items: [
          { text: 'Blog archive', link: '/other/blog-archive' },
          { text: 'Friends', link: '/other/friends/index' },
          { text: 'About me', link: '/other/about-me' },
        ]
      },
      
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/funeral-rain/toya.moe' },
    ],
  },
})
