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
   - install from the lockfile, checks, build, `publint`, smoke tests
   - `npm publish` via trusted publishing with a dist-tag derived from the version
   - GitHub Release with generated notes, marked as a prerelease for prerelease versions

Stable versions such as `1.0.0` publish under `latest`. Prerelease versions use
their first prerelease identifier as the dist-tag: `1.0.0-beta` and `1.0.0-beta.1`
publish under `beta`, while `1.0.0-rc.1` publishes under `rc`.
Use a lowercase channel name starting with a letter; `latest` is reserved for
stable releases. The Git tag must exactly match `v` followed by the package version,
for example `v1.0.0-beta`.
