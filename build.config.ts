import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['./src/index', './src/express/index', './src/fastify/index'],
  declaration: true,
  rollup: {
    emitCJS: false,
    inlineDependencies: ['fastify-plugin'],
  },
})
