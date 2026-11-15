import { defineConfig } from 'localbadge'

export default defineConfig({
  coverage: {
    outputDir: '.github/badges',
    fileName: 'coverage',
    badge: {
      label: 'coverage',
      color: 'brightgreen',
      labelColor: 'black',
      style: 'flat',
    },
  },
})
