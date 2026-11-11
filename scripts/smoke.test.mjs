import { execFile } from 'node:child_process'
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { promisify } from 'node:util'
import { createContext, runInContext } from 'node:vm'
import { expect, it } from 'vitest'

const require = createRequire(import.meta.url)
const root = new URL('..', import.meta.url)
const distEntry = new URL('../dist/index.mjs', import.meta.url)

const loadEsbuild = () => {
  const unbuildEntry = require.resolve('unbuild')
  const esbuildPath = require.resolve('esbuild', { paths: [dirname(unbuildEntry)] })
  return require(esbuildPath)
}

const assertNoNodeBuiltins = code => {
  expect(code).not.toMatch(/['"]node:/)
  expect(code).not.toMatch(/\brequire\(['"]fs['"]\)/)
}

it('runs a browser bundle without Node.js built-ins', async () => {
  const esbuild = loadEsbuild()
  const entry = `
    import { undevice } from ${JSON.stringify(distEntry.pathname)};
    globalThis.__undeviceSmoke = undevice().detect({
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
    });
  `

  const result = await esbuild.build({
    stdin: {
      contents: entry,
      resolveDir: root.pathname,
      sourcefile: 'smoke-browser-entry.mjs',
      loader: 'js',
    },
    bundle: true,
    write: false,
    platform: 'browser',
    format: 'iife',
    target: ['es2022'],
  })

  const code = result.outputFiles[0].text
  assertNoNodeBuiltins(code)

  const context = createContext({ globalThis: {} })
  runInContext(code, context)

  const flags = context.globalThis.__undeviceSmoke
  expect(flags?.isMobile).toBe(true)
})

it('runs a neutral ESM bundle with a custom crawler flag', async () => {
  const esbuild = loadEsbuild()
  const tempDir = mkdtempSync(join(tmpdir(), 'undevice-smoke-edge-'))
  const outfile = join(tempDir, 'edge.mjs')

  try {
    await esbuild.build({
      entryPoints: [distEntry.pathname],
      bundle: true,
      outfile,
      platform: 'neutral',
      format: 'esm',
      target: ['es2022'],
      conditions: ['worker', 'import', 'default'],
      mainFields: ['module', 'main'],
    })

    const code = await import('node:fs').then(fs => fs.readFileSync(outfile, 'utf8'))
    assertNoNodeBuiltins(code)

    const mod = await import(pathToFileURL(outfile).href)
    expect(Object.keys(mod)).toEqual(['undevice'])
    const flags = mod
      .undevice({
        isCrawler: ua => /Googlebot/i.test(ua),
      })
      .detect({
        userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      })

    expect(flags.isCrawler).toBe(true)
  } finally {
    rmSync(tempDir, { recursive: true, force: true })
  }
})

it('exports the Express adapter from the package subpath', async () => {
  const { undevice } = await import('undevice/express')
  const middleware = undevice({ isRawClient: ['curl'] })
  const res = { locals: {} }
  let calls = 0
  middleware({ headers: { 'user-agent': 'curl/8.0' } }, res, () => {
    calls += 1
  })
  expect(calls).toBe(1)
  expect(res.locals.undevice.isRawClient).toBe(true)
  expect(Object.isFrozen(res.locals.undevice)).toBe(true)
})

it.each(['typescript-docs', '@typescript/native'])(
  'emits consumer declarations using the built adapter types with %s',
  async compiler => {
    const tempDir = mkdtempSync(join(tmpdir(), 'undevice-smoke-types-'))
    const modules = join(tempDir, 'node_modules')
    const installedPackage = join(modules, 'undevice')

    try {
      mkdirSync(installedPackage, { recursive: true })
      cpSync(new URL('../dist', import.meta.url), join(installedPackage, 'dist'), {
        recursive: true,
      })
      cpSync(new URL('../package.json', import.meta.url), join(installedPackage, 'package.json'))
      for (const dependency of ['express', 'fastify', '@types']) {
        symlinkSync(
          new URL(`../node_modules/${dependency}`, import.meta.url),
          join(modules, dependency),
          'junction',
        )
      }
      writeFileSync(
        join(tempDir, 'consumer.mts'),
        `import express from 'express';
import Fastify from 'fastify';
import { undevice as middleware, type UndeviceMiddlewareFlags } from 'undevice/express';
import { undevice as plugin, type UndevicePluginFlags } from 'undevice/fastify';

export const expressDetector = middleware({ isRawClient: ['curl'] });
export const fastifyDetector = plugin({ isBot: ['bot'] });
export const createMiddleware = () => middleware({ isRawClient: ['curl'] });
export const createPlugin = () => plugin({ isBot: ['bot'] });

type ExpressFlags = UndeviceMiddlewareFlags<typeof expressDetector>;
type FastifyFlags = UndevicePluginFlags<typeof fastifyDetector>;
declare module 'undevice/express' {
  interface UndeviceCustomFlags extends ExpressFlags { isManualExpress: boolean }
}
declare module 'undevice/fastify' {
  interface UndeviceCustomFlags extends FastifyFlags { isManualFastify: boolean }
}

const app = express();
app.use(expressDetector);
app.get('/', (_req, res) => {
  const mobile: boolean = res.locals.undevice.isMobile;
  const raw: boolean = res.locals.undevice.isRawClient;
  const manual: boolean = res.locals.undevice.isManualExpress;
  // @ts-expect-error Fastify declarations must not leak into Express.
  res.locals.undevice.isBot;
  // @ts-expect-error Undeclared flags must not become any.
  res.locals.undevice.isNotDeclared;
  res.json({ mobile, raw, manual });
});
const server = Fastify();
await server.register(fastifyDetector);
server.get('/', request => {
  const mobile: boolean = request.undevice.isMobile;
  const bot: boolean = request.undevice.isBot;
  const manual: boolean = request.undevice.isManualFastify;
  // @ts-expect-error Express declarations must not leak into Fastify.
  request.undevice.isRawClient;
  // @ts-expect-error Undeclared flags must not become any.
  request.undevice.isNotDeclared;
  return { mobile, bot, manual };
});
`,
      )
      writeFileSync(
        join(tempDir, 'tsconfig.json'),
        JSON.stringify({
          compilerOptions: {
            target: 'ES2022',
            module: 'NodeNext',
            moduleResolution: 'NodeNext',
            strict: true,
            skipLibCheck: false,
            declaration: true,
            emitDeclarationOnly: true,
            outDir: 'output',
            types: ['node'],
          },
          files: ['consumer.mts'],
        }),
      )
      try {
        const executable = join(dirname(require.resolve(`${compiler}/package.json`)), 'bin/tsc')
        await promisify(execFile)(process.execPath, [executable, '-p', tempDir], { cwd: tempDir })
      } catch (error) {
        throw new Error(`${compiler}: ${error.stdout}\n${error.stderr}`, { cause: error })
      }
      const declarations = readFileSync(join(tempDir, 'output/consumer.d.mts'), 'utf8')
      expect(declarations).toContain('UndeviceMiddleware')
      expect(declarations).toContain('UndevicePlugin')
      expect(declarations).not.toContain('undevice/dist/shared')
    } finally {
      rmSync(tempDir, { recursive: true, force: true })
    }
  },
  30_000,
)
