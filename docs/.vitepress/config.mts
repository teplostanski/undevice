import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import ts from 'typescript-docs'
import { type DefaultTheme, defineConfigWithTheme, type UserConfig } from 'vitepress'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import llmstxt, { copyOrDownloadAsMarkdownButtons } from 'vitepress-plugin-llms'

const origin = 'https://undevice.hacks.run'
const repo = 'https://github.com/teplostanski/undevice'
const { version } = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8'))
const apiSidebar = JSON.parse(
  readFileSync(new URL('../api/typedoc-sidebar.json', import.meta.url), 'utf8'),
)

const sidebar = (ru = false) => {
  const prefix = ru ? '/ru' : ''
  return [
    {
      text: ru ? 'Руководство' : 'Guide',
      items: [
        { text: ru ? 'Начало работы' : 'Getting started', link: `${prefix}/guide/getting-started` },
        {
          text: ru ? 'Параметры и результат' : 'Input and result',
          link: `${prefix}/guide/detection`,
        },
        {
          text: ru ? 'Пользовательские флаги' : 'Custom flags',
          link: `${prefix}/guide/custom-flags`,
        },
        { text: 'CDN', link: `${prefix}/guide/cdn` },
        { text: ru ? 'Скилл для агента' : 'Agent skill', link: `${prefix}/guide/agent-skill` },
        { text: ru ? 'Песочница' : 'Playground', link: `${prefix}/playground` },
      ],
    },
    {
      text: ru ? 'Интеграции' : 'Integrations',
      items: [
        { text: ru ? 'Обзор' : 'Overview', link: `${prefix}/integrations/` },
        { text: 'Express', link: `${prefix}/integrations/express` },
        { text: ru ? 'API ядра и SSR' : 'Core API and SSR', link: `${prefix}/guide/integrations` },
      ],
    },
    { text: 'API', items: apiSidebar },
  ]
}

export default defineConfigWithTheme<DefaultTheme.Config & Pick<DefaultTheme, 'llms'>>({
  title: 'undevice',
  srcExclude: ['NPM_RELEASE_TAG_MVP.md', 'V2_CRAWLER_DISCUSSION.md'],
  description: 'Portable device, OS, and browser detection. Bring your own flags.',
  lang: 'en-US',
  cleanUrls: true,
  lastUpdated: true,
  sitemap: { hostname: origin },
  head: [
    [
      'link',
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/logo-dark.svg',
        media: '(prefers-color-scheme: light)',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/logo-light.svg',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    ['link', { rel: 'apple-touch-icon', href: '/logo-light.png' }],
    ['meta', { name: 'theme-color', content: '#ce3300' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'undevice' }],
    ['meta', { property: 'og:image', content: `${origin}/logo-dark.png` }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
  ],
  transformPageData(pageData) {
    if (pageData.relativePath.startsWith('api/')) {
      pageData.frontmatter.editLink = false
      pageData.frontmatter.lastUpdated = false
    }
  },
  transformHead({ pageData }) {
    const path = pageData.relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')
    const url = `${origin}/${path}`
    return [
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:title', content: `${pageData.title || 'undevice'} | undevice` }],
      [
        'meta',
        {
          property: 'og:description',
          content: pageData.description || 'Portable device detection with custom flags.',
        },
      ],
    ]
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      themeConfig: {
        nav: [
          { text: 'Guide', link: '/guide/getting-started' },
          { text: 'Integrations', link: '/integrations/' },
          { text: 'API', link: '/api/' },
          { text: 'Playground', link: '/playground' },
          { text: version, link: `${repo}/releases` },
        ],
        sidebar: sidebar(),
      },
    },
    ru: {
      label: 'Русский',
      lang: 'ru-RU',
      link: '/ru/',
      description: 'Определение устройства, ОС и браузера. Ваши проверки, ваши флаги.',
      themeConfig: {
        nav: [
          { text: 'Руководство', link: '/ru/guide/getting-started' },
          { text: 'Интеграции', link: '/ru/integrations/' },
          { text: 'API', link: '/api/' },
          { text: 'Песочница', link: '/ru/playground' },
          { text: version, link: `${repo}/releases` },
        ],
        sidebar: sidebar(true),
        llms: {
          copyText: 'Копировать страницу',
          copiedText: 'Скопировано',
          viewMarkdownText: 'Открыть Markdown',
          openInAIText: 'Открыть в {provider}',
        },
        outline: { label: 'На этой странице', level: [2, 3] },
        docFooter: { prev: 'Предыдущая страница', next: 'Следующая страница' },
        footer: {
          message:
            'Распространяется по лицензии MIT.<br><em>Проект не связан с организацией <a href="https://unjs.io/">UnJS</a>.</em>',
          copyright: '© 2026 Теплостанский Игорь',
        },
        editLink: { pattern: `${repo}/edit/main/docs/:path`, text: 'Редактировать страницу' },
        lastUpdated: { text: 'Обновлено' },
        returnToTopLabel: 'Наверх',
        sidebarMenuLabel: 'Меню',
        darkModeSwitchLabel: 'Тема',
      },
    },
  },
  themeConfig: {
    logo: { light: '/logo-dark.svg', dark: '/logo-light.svg', alt: 'undevice' },
    search: {
      provider: 'local',
      options: {
        locales: {
          ru: {
            translations: {
              button: { buttonText: 'Поиск', buttonAriaLabel: 'Поиск' },
              modal: {
                noResultsText: 'Ничего не найдено',
                resetButtonTitle: 'Сбросить',
                footer: { selectText: 'выбрать', navigateText: 'перейти', closeText: 'закрыть' },
              },
            },
          },
        },
      },
    },
    socialLinks: [
      { icon: 'github', link: repo },
      {
        icon: { svg: readFileSync(new URL('../public/npmx.svg', import.meta.url), 'utf8') },
        link: 'https://npmx.dev/package/undevice',
        ariaLabel: 'undevice on npmx',
      },
    ],
    outline: [2, 3],
    editLink: { pattern: `${repo}/edit/main/docs/:path`, text: 'Edit this page' },
    footer: {
      message:
        'Released under the MIT License.<br><em>not affiliated with the <a href="https://unjs.io/">unjs</a> org.</em>',
      copyright: 'Copyright © 2026 Teplostanski Igor',
    },
  },
  markdown: {
    theme: { light: 'github-light', dark: 'github-dark' },
    codeTransformers: [
      transformerTwoslash({
        twoslashOptions: {
          tsModule: ts,
          tsLibDirectory: dirname(
            createRequire(import.meta.url).resolve('typescript-docs/lib/lib.esnext.full.d.ts'),
          ),
          compilerOptions: {
            ignoreDeprecations: '6.0',
            baseUrl: fileURLToPath(new URL('../../', import.meta.url)),
            paths: { undevice: ['src/index.ts'] },
          },
        },
      }),
    ],
    config(md) {
      md.use(groupIconMdPlugin)
      md.use(copyOrDownloadAsMarkdownButtons)
    },
  },
  vite: {
    plugins: [
      // The plugin supports Vite 5, but its peer types resolve to Vitest's Vite 8.
      groupIconVitePlugin() as NonNullable<NonNullable<UserConfig['vite']>['plugins']>[number],
      llmstxt({
        domain: origin,
        ignoreFiles: ['NPM_RELEASE_TAG_MVP.md', 'V2_CRAWLER_DISCUSSION.md'],
        ignoreFilesPerOutput: { llmsTxt: ['ru/**', 'ru.md'], llmsFullTxt: ['ru/**', 'ru.md'] },
      }),
    ],
  },
})
