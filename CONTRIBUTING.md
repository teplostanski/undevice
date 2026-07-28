# Contribution

## Local development

- Clone this repository
- Install the latest LTS version of [Node.js](https://nodejs.org/en/)
- Install dependencies using `pnpm install` (enables Husky git hooks via `prepare`)
- Run interactive tests using `pnpm dev`
- Run checks using `pnpm lint && pnpm typecheck && pnpm test && pnpm build`
- Pre-commit runs `pnpm lint` automatically

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
