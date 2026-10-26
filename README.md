# undevice

[![version][npm-version-src]][npm-version-href]
[![downloads][npm-downloads-src]][npm-downloads-href]
[![license][npm-license-src]][npm-license-href]
[![codecov][codecov-src]][codecov-href]
[![size][npm-size-src]][npm-size-href]

**Unified Device Detector**

Device, OS, and browser detection from User-Agent and CDN headers.
Works in Node.js, browsers, and edge runtimes without framework dependencies.

- ESM with TypeScript types.
- Cloudflare and CloudFront header support.
- Custom detection flags.
- Dependency-free.
- Integrations: [Express](https://undevice.hacks.run/integrations/express).

**[Documentation](https://undevice.hacks.run) · [Playground](https://undevice.hacks.run/playground)**

_Not affiliated with the [UnJS](https://unjs.io/) organization._

## Contents

- [Install](#install)
- [Agent skill](#agent-skill)
- [Usage](#usage)
  - [Custom flags](#custom-flags)
- [Integrations](#integrations)
  - [Express](#express)
- [CloudFront](#cloudfront)
- [Cloudflare](#cloudflare)
- [Compatibility](#compatibility)
- [Credits](#credits)
- [License](#license)

## Install

```bash
npm install undevice
```

## Agent skill

Install the [undevice skill](skills/undevice/SKILL.md) to help your coding agent use the API, configure custom flags, and integrate detection into request handlers and SSR.

```bash
npx skills add teplostanski/undevice --skill undevice
```

For Express middleware and route types, use the [Express skill](skills/undevice-express/SKILL.md).

```sh
npx skills add teplostanski/undevice --skill undevice-express
```

## Usage

Create a detector once, then pass each request's headers to `detect()`:

```ts
import { undevice } from "undevice";

const { detect } = undevice();
const device = detect({ headers: request.headers });

device.isMobile;
device.isTablet;
device.isDesktop;
```

See the [documentation](https://undevice.hacks.run/guide/getting-started) for input options, flags, and API details.

### Custom flags

```ts
import { undevice } from "undevice";

const { detect } = undevice({ isRawClient: ["curl", "wget"] });
const device = detect({ userAgent: "curl/8.0" });

device.isRawClient; // true
```

See [Custom flags](https://undevice.hacks.run/guide/custom-flags) for callbacks, exclusions, and more examples.

## Integrations

### Express

```ts
import express from "express";
import { undevice } from "undevice/express";

const app = express();
app.use(undevice());

app.get("/device", (_req, res) => {
  res.json(res.locals.undevice);
});
```

See the [Express guide](https://undevice.hacks.run/integrations/express) for custom flags and TypeScript declarations.

## CloudFront

When the User-Agent matches `Amazon CloudFront` case-insensitively, the following headers are checked:

- `CloudFront-Is-Android-Viewer`
- `CloudFront-Is-Desktop-Viewer`
- `CloudFront-Is-IOS-Viewer`
- `CloudFront-Is-Mobile-Viewer`
- `CloudFront-Is-Tablet-Viewer`

Pass request headers via `headers`. If no device type header is `true`,
the result includes `isUnknown: true`.

> [!CAUTION]
> CloudFront does not provide headers for detecting Windows or macOS.

[Configure device type headers in CloudFront](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/adding-cloudfront-headers.html#cloudfront-headers-device-type).

## Cloudflare

If the CloudFront rule does not apply and `CF-Device-Type` is `mobile`, `tablet`,
or `desktop`, that value takes precedence over the User-Agent for device type
detection. If the header is missing or its value is unrecognized, detection
falls back to the User-Agent.

[Configure Cache by device type in Cloudflare APO](https://developers.cloudflare.com/automatic-platform-optimization/reference/cache-device-type/).

## Compatibility

Node.js 22+. ESM only. Browsers and edge runtimes must support ES2022 APIs.

## Credits

Inspired by [@nuxtjs/device](https://github.com/nuxt-modules/device).

## License

[MIT](./LICENSE) License © 2026-PRESENT [Teplostanski Igor](https://github.com/teplostanski)

<!-- Badges -->

[npm-version-src]: https://npmx.dev/api/registry/badge/version/undevice
[npm-version-href]: https://npmx.dev/package/undevice
[npm-downloads-src]: https://npmx.dev/api/registry/badge/downloads/undevice
[npm-downloads-href]: https://npmx.dev/package/undevice
[npm-size-src]: https://img.shields.io/bundlephobia/minzip/undevice?style=flat&label=size&labelColor=0a0a0a&color=a855f7
[npm-size-href]: https://bundlephobia.com/package/undevice
[npm-license-src]: https://npmx.dev/api/registry/badge/license/undevice
[npm-license-href]: https://npmx.dev/package/undevice
[codecov-src]: https://img.shields.io/codecov/c/github/teplostanski/undevice?style=flat&label=coverage&labelColor=0a0a0a
[codecov-href]: https://codecov.io/gh/teplostanski/undevice
