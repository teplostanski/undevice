import { mkdtempSync, rmSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { pathToFileURL } from 'node:url'
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
