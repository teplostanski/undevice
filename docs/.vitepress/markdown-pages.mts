import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { createContentLoader, type SiteConfig } from 'vitepress'

type HomeFrontmatter = {
  hero?: {
    name?: string
    text?: string
    tagline?: string
    actions?: { text: string; link: string }[]
  }
  features?: { title: string; details: string; link?: string; linkText?: string }[]
}

function homeIntroduction({ hero, features = [] }: HomeFrontmatter): string {
  return [
    `# ${hero?.name ?? 'undevice'}`,
    hero?.text,
    hero?.tagline,
    hero?.actions?.map(action => `- [${action.text}](${action.link})`).join('\n'),
    ...features.map(feature =>
      [
        `## ${feature.title}`,
        feature.details,
        feature.link ? `[${feature.linkText ?? feature.title}](${feature.link})` : '',
      ]
        .filter(Boolean)
        .join('\n\n'),
    ),
  ]
    .filter(Boolean)
    .join('\n\n')
}

/** Complete the plugin's Markdown output using the same source as the HTML pages. */
export async function completeMarkdownPages(config: SiteConfig): Promise<void> {
  const homePages = await createContentLoader(['index.md', 'ru/index.md']).load()
  const bundlePath = join(config.outDir, 'llms-full.txt')
  let bundle = await readFile(bundlePath, 'utf8')

  for (const page of homePages) {
    const output = page.url === '/' ? 'index.md' : `${page.url.slice(1, -1)}.md`
    const file = join(config.outDir, output)
    const original = await readFile(file, 'utf8')
    const completed = original.replace(
      /^(---\n[\s\S]*?\n---\n)/,
      metadata => `${metadata}\n${homeIntroduction(page.frontmatter)}\n\n`,
    )
    await writeFile(file, completed)
    bundle = bundle.replace(original, () => completed)
  }
  await writeFile(bundlePath, bundle)

  // The plugin flattens directory indexes. Keep the original URLs available too,
  // including TypeDoc's /api/index.md links and agents requesting /ru/index.md.
  for (const page of config.pages.filter(page => page.endsWith('/index.md'))) {
    const flattened = page.replace(/\/index\.md$/, '.md')
    const original = await readFile(join(config.outDir, flattened), 'utf8')
    const alias = original.replace(/^(url: https?:\/\/[^\n]+)\.md$/m, '$1/index.md')
    const destination = join(config.outDir, page)
    await mkdir(dirname(destination), { recursive: true })
    await writeFile(destination, alias)
  }
}
