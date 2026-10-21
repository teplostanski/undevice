import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import CopyOrDownloadAsMarkdownButtons from 'vitepress-plugin-llms/vitepress-components/CopyOrDownloadAsMarkdownButtons.vue'
import DevicePlayground from './DevicePlayground.vue'
import '@shikijs/vitepress-twoslash/style.css'
import 'virtual:group-icons.css'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(TwoslashFloatingVue)
    app.component('DevicePlayground', DevicePlayground)
    app.component('CopyOrDownloadAsMarkdownButtons', CopyOrDownloadAsMarkdownButtons)
  },
} satisfies Theme
