# Contribution

## Local development

- Clone this repository
- Use Node.js 24 or 26 for development (`.nvmrc` selects 26; releases use 24)
- Use the pnpm version pinned in `package.json` (`packageManager`)
- Install dependencies using `pnpm install` (enables Husky git hooks via `prepare`)
- Run interactive tests using `pnpm dev`
- Run formatting, lint, and type checks using `pnpm check`
- Run all local checks using `pnpm check:full`
- `pnpm check:lib` checks formatting, lint, types, tests, the build, package validity, and smoke tests; CI and releases use the same command
- Pre-commit runs `pnpm check:full` via Husky, including coverage, documentation build, and documentation smoke tests; formatting is checked without rewriting or staging files
- Pre-push runs `pnpm docs:build && pnpm docs:smoke` to validate freshly generated documentation

Biome handles linting, formatting, and import organization. Run `pnpm lint:fix`
to apply its safe fixes. Shared rules come from `@teplostanski/biome-config`;
`biome.json` keeps project-specific exclusions, VCS settings, and overrides.
Markdown and YAML formatting are enabled alongside TypeScript and JSON.

Development dependencies (pnpm, Vitest/Vite, TypeScript, and unbuild) have their
own Node.js requirements. These do not determine the published `engines.node`
range. The package supports Node.js `>=22`, with Node.js 22 as the oldest
supported LTS line. CI runs the Vitest suite on Node.js 22 and 24.
`pnpm smoke` also uses Vitest to check browser and edge-like bundles after
`pnpm build`; these checks run inside Node.js, not actual browser or edge engines.
The smoke suite also copies the built package into a temporary consumer project
and emits declarations for inferred Express and Fastify adapters, checking custom
flag augmentation without importing library source files.

### Dependency compatibility

VitePress 1.6 uses Shiki 2, so keep `@shikijs/vitepress-twoslash` on 2.x until
VitePress supports a newer Shiki. TypeDoc and Twoslash still need the TypeScript 6
compiler API; the main type check uses TypeScript 7 through `@typescript/native`.
Node types stay on 22.x to match the library's minimum supported Node version.

The TypeDoc patch in `patches/` replaces its removed `minimatch.matchOne` call
with public partial matching, allowing the security override to minimatch 11.
Recheck whether the patch is still necessary when upgrading TypeDoc.

Audit review (2026-11-07): `deepmerge` GHSA-gcqx-w48m-w2h4 remains a low-severity
build-only finding without a published fix. Rollup's resolver uses it to copy
static defaults, not request data. Recheck by 2026-12-07 or when unbuild updates.

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

## Documentation

The VitePress site lives in `docs/` and targets https://undevice.hacks.run.

- `pnpm docs:dev`: generate the API reference and start the local development server.
- `pnpm docs:typecheck`: check the VitePress configuration types.
- `pnpm docs:build`: regenerate the TypeDoc reference, check configuration types, and build the static site.
- `pnpm docs:smoke`: check the built HTML, Markdown discovery, local links, and LLM bundle.
- `pnpm docs:preview`: preview the production build.

Edit English pages in `docs/guide/` and Russian pages in `docs/ru/guide/` together.
The Russian README remains a local reference; the site builds entirely from tracked
files in `docs/`. Generated `docs/api/` pages must not be edited or committed.
Update source JSDoc and rerun `pnpm docs:api` instead.

Mark self-contained TypeScript examples with `ts twoslash` to validate them and show
type hints. Twoslash uses the `typescript-docs` alias because the project's
TypeScript 6 package does not ship the standard library files required by its VFS.
This does not change the library compiler. The public API reference is in English
and shared by both locales. Local search indexes both languages. The LLM index and
full bundle contain English docs; per-page Markdown is available in both languages.

The Markdown build includes homepage text from the same frontmatter used by the
HTML hero and features. Directory indexes are available at both `/path.md` and
`/path/index.md`. TypeDoc uses root-relative `/api/` links so both forms work.
The documentation workflow runs `docs:smoke` before uploading the Pages artifact.

GitHub Pages serves static files. Markdown is discovered through HTML alternate
links and fetched at explicit `.md` URLs. It does not negotiate `Accept` headers;
HTTP `Link`, `Vary: Accept`, and format-specific `406` responses require a proxy
or another hosting platform with request handlers. No such handler is deployed
by this repository. `robots.txt` permits search and AI input; it does not declare
a policy for model training. Server-side AI traffic analytics are not configured.

CI builds the site on Node.js 24. To host on GitHub Pages, select GitHub Actions as
the Pages source, configure the custom domain `undevice.hacks.run`, and point its
DNS CNAME to `teplostanski.github.io`. The **docs** workflow builds and deploys the site on every push to `main`
and also supports manual runs from `main`. Pushing a release tag alone does not
trigger documentation deployment.
Enable HTTPS once GitHub has provisioned the certificate. DNS and repository Pages
settings must be configured by the repository owner.

For other static hosts, use `pnpm docs:build` and publish `docs/.vitepress/dist`.
