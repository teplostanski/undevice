# Social previews

`index.html` contains two fixed 1200 x 630 layouts using the documentation's Inter
font, logos, and theme colors. Run `pnpm install` before opening the file locally.

- `index.html`: dark documentation card, exported to `docs/public/og-docs.png`.
- `index.html#express`: light Express card, exported to `docs/public/og-express.png`.

Capture the viewport at 1200 x 630 with device scale factor 1 after
`document.fonts.ready` resolves. The committed PNGs are served directly; the HTML
source is not published with the documentation. Re-export the PNGs after edits.

The Express mark in `express.svg` comes from
[Simple Icons](https://simpleicons.org/?q=express), distributed under
[CC0](https://github.com/simple-icons/simple-icons/blob/develop/LICENSE.md).
