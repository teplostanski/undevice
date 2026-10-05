# undevice

[![version][npm-version-src]][npm-version-href]
[![downloads][npm-downloads-src]][npm-downloads-href]
[![license][npm-license-src]][npm-license-href]
[![codecov][codecov-src]][codecov-href]
[![size][npm-size-src]][npm-size-href]

Runtime-agnostic device, OS, browser, and bot detection from User-Agent and CDN headers.
Works in Node.js, browsers, and edge runtimes without framework dependencies.

- ESM with TypeScript types.
- Cloudflare and CloudFront header support.
- Bot detection using `isbot`.

_Not affiliated with the [UnJS](https://unjs.io/) organization._

## Install

```bash
npm install undevice
```

## Usage

### Request headers

Pass the incoming request's headers to `undevice()`:

```ts
import { undevice } from "undevice";

const device = undevice({ headers: request.headers });

device.isMobile;
device.isTablet;
device.isDesktop;
```

Returns a frozen [UndeviceResult](#undeviceresult) with detection [flags](#result).
No input mutation or implicit access to request context or browser globals.

### User-Agent

In the browser, pass `navigator.userAgent`:

```ts
import { undevice } from "undevice";

const device = undevice({ userAgent: navigator.userAgent });
```

To override the User-Agent:

```ts
const device = undevice({
  headers: request.headers,
  userAgent: customUserAgent,
});
```

For SSR, reuse the server's result on the client to avoid hydration mismatches.

### Options

```ts
declare function undevice(options?: {
  headers?: RequestHeaders;
  userAgent?: string;
}): UndeviceResult;
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `headers` | [`RequestHeaders`](#requestheaders) | `undefined` | Request headers. Accepts a standard [`Headers`](https://developer.mozilla.org/en-US/docs/Web/API/Headers) instance or a plain record, including Node.js request headers. |
| `userAgent` | `string` | From `headers` | Explicit override for the `user-agent` header. Also supports standalone UA detection. |

### Result

[`UndeviceResult`](#undeviceresult) contains the following flags:

| Group | Flags |
| --- | --- |
| Device | `isMobile`, `isTablet`, `isDesktop`, `isUnknown` |
| Combined | `isMobileOrTablet`, `isDesktopOrTablet` |
| OS | `isIos`, `isAndroid`, `isWindows`, `isMacOS`, `isLinux`, `isApple` |
| Browser | `isChrome`, `isFirefox`, `isSafari`, `isEdge`, `isSamsung` |
| Bot | `isCrawler` |

_`isUnknown` is the fallback when the input does not resolve to a supported device type._

### Types

#### UndeviceOptions

Options for `undevice`, with optional User-Agent and [request headers](#requestheaders).

```ts
type UndeviceOptions = Readonly<{
  userAgent?: string;
  headers?: RequestHeaders;
}>;
```

#### RequestHeaders

A header record or a structural `get()` interface compatible with standard [`Headers`](https://developer.mozilla.org/en-US/docs/Web/API/Headers):

```ts
type RequestHeaders =
  | Readonly<Record<string, string | readonly string[] | undefined>>
  | Readonly<{ get(name: string): string | null }>;
```

#### UndeviceResult

The return type of `undevice`, containing the detection [flags](#result).

## CloudFront

When the User-Agent is `Amazon CloudFront`, the following headers are checked:

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

When `CF-Device-Type` is `mobile`, `tablet`, or `desktop`, its value takes precedence
over the User-Agent for device type detection. If the header is missing or has an
unrecognized value, detection falls back to the User-Agent.

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
