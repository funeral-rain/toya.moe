import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Funeral Rain's Blog",
  description: "The blog for Toya, kawaii but \"arrogant\" little girl !",
  //base: '/',
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
          { text: '一个初级的C语言序列化实现', link: '/tech/c-language-serialization' },
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
