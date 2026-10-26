import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['./src/index', './src/express/index'],
  declaration: true,
  rollup: {
    emitCJS: false,
  },
})
