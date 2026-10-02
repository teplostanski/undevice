# Contribution

## Local development

- Clone this repository
- Use Node.js 24 or 26 for development (`.nvmrc` selects 26; releases use 24)
- Use the pnpm version pinned in `package.json` (`packageManager`)
- Install dependencies using `pnpm install` (enables Husky git hooks via `prepare`)
- Run interactive tests using `pnpm dev`
- Run checks using `pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm publint && pnpm smoke`
- Pre-commit runs `biome check .` automatically (via Husky; skips pnpm TTY prompts)

Biome handles linting, formatting, and import organization. Run `pnpm lint:fix`
to apply its safe fixes. Its configuration is in `biome.json`.

Development dependencies (pnpm, Vitest/Vite, TypeScript, and unbuild) have their
own Node.js requirements. These do not determine the published `engines.node`
range. The package supports Node.js `>=22`, with Node.js 22 as the oldest
supported LTS line. CI runs the Vitest suite on Node.js 22 and 24.
`pnpm smoke` also uses Vitest to check browser and edge-like bundles after
`pnpm build`; these checks run inside Node.js, not actual browser or edge engines.

## Pull requests

- Keep changes focused
- Add or update tests for behavior changes
- Use [Conventional Commits](https://www.conventionalcommits.org/)

## Release

1. Bump `version` in `package.json` on `main`
2. Push a matching tag, for example `v0.2.0`
3. GitHub Actions runs `.github/workflows/release.yml`:
   - checks, build, `publint`
   - `npm publish` via trusted publishing
   - GitHub Release with generated notes
