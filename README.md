# undevice

[![version][npm-version-src]][npm-version-href]
[![downloads][npm-downloads-src]][npm-downloads-href]
[![size][npm-size-src]][npm-size-href]
[![license][npm-license-src]][npm-license-href]
[![codecov][codecov-src]][codecov-href]

Runtime-agnostic device detection from User-Agent and CDN headers.

Works on Node.js, browsers, and edge runtimes.

*Not affiliated with the [UnJS](https://unjs.io) organization.*

## Install

```bash
# npm
npm install undevice

# pnpm
pnpm install undevice

# yarn
yarn add undevice

# bun
bun install undevice
```

## Usage

```js
import { detectDevice } from "undevice";

const device = detectDevice({
  userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
});

device.isMobile; // true
device.isIos; // true
device.isSafari; // true
```

`detectDevice` is a pure function. Pass `userAgent` and optional `headers` — it does not read globals.

```js
const device = detectDevice({
  userAgent: request.headers.get("user-agent") || undefined,
  headers: Object.fromEntries(request.headers),
});
```

## Flags

Exactly one device kind flag is `true`:

- `isMobile`
- `isTablet`
- `isDesktop`
- `isUnknown`

Derived:

- `isMobileOrTablet`
- `isDesktopOrTablet`

OS:

- `isIos` / `isAndroid` / `isWindows` / `isMacOS` / `isLinux` / `isApple`

Browser:

- `isChrome` / `isFirefox` / `isSafari` / `isEdge` / `isSamsung`

Other:

- `isCrawler`

## CDN Headers

Detection order:

1. CloudFront viewer headers when `userAgent` is `Amazon CloudFront`
2. Cloudflare `cf-device-type`
3. User-Agent string

```js
import { CloudflareHeader, CloudflareDeviceType, detectDevice } from "undevice";

detectDevice({
  userAgent: "Mozilla/5.0 ...",
  headers: {
    [CloudflareHeader.DeviceType]: CloudflareDeviceType.Mobile,
  },
});
```

```js
import { CloudFrontHeader, CloudFrontUserAgent, detectDevice } from "undevice";

detectDevice({
  userAgent: CloudFrontUserAgent.AmazonCloudFront,
  headers: {
    [CloudFrontHeader.IsMobileViewer]: "true",
    [CloudFrontHeader.IsIosViewer]: "true",
  },
});
```

## Constants

```js
import {
  DeviceKind,
  BrowserName,
  CloudflareHeader,
  CloudflareDeviceType,
  CloudFrontHeader,
  CloudFrontUserAgent,
} from "undevice";

DeviceKind.Mobile; // "mobile"
CloudflareHeader.DeviceType; // "cf-device-type"
```

## Notes

- Empty User-Agent without CDN hints → `isUnknown: true`
- Header names are case-insensitive
- For SSR, pass the same input on server and client
- User-Agent detection is heuristic, not a security check

Feature set inspired by [`@nuxtjs/device`](https://github.com/nuxt-modules/device).

## License

[MIT](./LICENSE)

<!-- Badges -->

[npm-version-src]: https://npmx.dev/api/registry/badge/version/undevice
[npm-version-href]: https://npmx.dev/package/undevice
[npm-downloads-src]: https://npmx.dev/api/registry/badge/downloads/undevice
[npm-downloads-href]: https://npmx.dev/package/undevice
[npm-size-src]: https://npmx.dev/api/registry/badge/size/undevice
[npm-size-href]: https://npmx.dev/package/undevice
[npm-license-src]: https://npmx.dev/api/registry/badge/license/undevice
[npm-license-href]: https://npmx.dev/package/undevice
[codecov-src]: https://codecov.io/gh/teplostanski/undevice/graph/badge.svg
[codecov-href]: https://codecov.io/gh/teplostanski/undevice
