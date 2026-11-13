import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { test } from 'node:test'
import { createMarkdownRenderer } from 'vitepress'

const root = resolve('docs/.vitepress/dist')
const files = new Set(await readdir(root, { recursive: true }))
const origin = 'https://undevice.hacks.run'
const markdown = await createMarkdownRenderer(resolve('docs'))
const read = path => readFile(resolve(root, path), 'utf8')
const htmlPages = [...files].filter(file => file.endsWith('.html') && file !== '404.html')
const markdownPath = html => html.replace(/\/index\.html$/, '.md').replace(/\.html$/, '.md')

const links = source => {
  return markdown
    .parse(source, {})
    .flatMap(token => token.children ?? [])
    .filter(token => token.type === 'link_open')
    .map(token => token.attrGet('href'))
}

test('each content page exposes Markdown and server-rendered HTML', async () => {
  for (const page of htmlPages) {
    const html = await read(page)
    const path = markdownPath(page)
    assert.ok(files.has(path), `${page}: missing ${path}`)
    assert.match(
      html,
      new RegExp(`<link[^>]*href="/${path.replaceAll('.', '\\.')}"[^>]*type="text/markdown"`),
      `${page}: missing Markdown alternate`,
    )
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${page}: expected one h1`)
    assert.ok(html.indexOf('<h1') < 100_000, `${page}: heading beyond fetch budget`)
    assert.ok(!html.includes('Are you an LLM?'), `${page}: hidden LLM hint`)
    const main = /<main\b[^>]*>([\s\S]*?)<\/main>/.exec(html)?.[1]
    if (main) {
      let previous = 0
      for (const heading of main.matchAll(/<h([1-6])\b/g)) {
        const level = Number(heading[1])
        assert.ok(level <= previous + 1, `${page}: skipped heading level before h${level}`)
        previous = level
      }
    }
  }
})

test('Markdown and LLM indexes have no broken local links', async () => {
  const pages = [...files].filter(file => file.endsWith('.md') || /^llms.*\.txt$/.test(file))
  for (const page of pages) {
    for (const href of links(await read(page))) {
      const url = new URL(href, `${origin}/${page}`)
      if (url.origin !== origin) continue
      const path = decodeURIComponent(url.pathname).slice(1)
      const candidates = path.endsWith('/')
        ? [`${path}index.html`]
        : [path, `${path}.html`, `${path}/index.html`]
      assert.ok(
        candidates.some(candidate => files.has(candidate)),
        `${page}: broken link ${href}`,
      )
    }
  }
})

test('home Markdown includes the visible introduction and navigation', async () => {
  for (const [path, title, action] of [
    ['index.md', 'Unified Device Detector', '/guide/getting-started'],
    ['ru.md', 'Единый детектор устройств', '/ru/guide/getting-started'],
  ]) {
    const source = await read(path)
    assert.match(source, /^# undevice$/m)
    assert.ok(source.includes(title), `${path}: missing hero text`)
    assert.ok(links(source).includes(action), `${path}: missing navigation`)
  }
  for (const alias of [
    'api/index.md',
    'ru/index.md',
    'adapters/index.md',
    'ru/adapters/index.md',
  ]) {
    assert.ok(files.has(alias), `missing index alias ${alias}`)
    assert.ok((await read(alias)).includes(`url: ${origin}/${alias}`))
  }
})

test('the English full bundle contains the completed Markdown pages', async () => {
  const index = await read('llms.txt')
  const bundle = await read('llms-full.txt')
  assert.match(index, /^# undevice\n\n> /)
  assert.match(await read('guide/agent-skill.html'), /href="\/llms\.txt"/)
  for (const page of htmlPages.filter(page => !page.startsWith('ru/'))) {
    const path = markdownPath(page)
    assert.ok(bundle.includes(await read(path)), `${path}: missing or stale full-bundle content`)
    assert.ok(links(index).includes(`${origin}/${path}`), `${path}: missing index link`)
  }
})

test('robots allows fetching and declares search and AI input signals', async () => {
  const robots = await read('robots.txt')
  assert.match(robots, /User-agent: \*\nAllow: \/\n/)
  assert.match(robots, /^Content-Signal: search=yes, ai-input=yes$/m)
})
