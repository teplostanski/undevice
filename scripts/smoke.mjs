import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { createContext, runInContext } from 'node:vm'

const require = createRequire(import.meta.url)
const root = new URL('..', import.meta.url)
const distEntry = new URL('../dist/index.mjs', import.meta.url)

const loadEsbuild = () => {
  const unbuildEntry = require.resolve('unbuild')
  const esbuildPath = require.resolve('esbuild', { paths: [dirname(unbuildEntry)] })
  return require(esbuildPath)
}

const assertNoNodeBuiltins = (code, label) => {
  if (/['"]node:/.test(code) || /\brequire\(['"]fs['"]\)/.test(code)) {
    throw new Error(`${label}: bundle contains Node-only imports`)
  }
}

const smokeBrowserBundler = async () => {
  const esbuild = loadEsbuild()
  const entry = `
    import { detectDevice } from ${JSON.stringify(distEntry.pathname)};
    globalThis.__undeviceSmoke = detectDevice({
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
  assertNoNodeBuiltins(code, 'browser bundle')

  const context = createContext({ globalThis: {} })
  runInContext(code, context)

  const flags = context.globalThis.__undeviceSmoke
  if (!flags?.isMobile) {
    throw new Error('browser bundle: expected isMobile for iPhone UA')
  }

  console.log('ok: browser bundler')
}

const smokeEdgeLikeRuntime = async () => {
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
    assertNoNodeBuiltins(code, 'edge bundle')

    const mod = await import(pathToFileURL(outfile).href)
    const flags = mod.detectDevice({
      userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    })

    if (!flags.isCrawler) {
      throw new Error('edge bundle: expected isCrawler for Googlebot')
    }

    console.log('ok: edge-like runtime')
  }
  finally {
    rmSync(tempDir, { recursive: true, force: true })
  }
}

await smokeBrowserBundler()
await smokeEdgeLikeRuntime()
