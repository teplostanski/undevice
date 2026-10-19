# undevice

[![version][npm-version-src]][npm-version-href]
[![downloads][npm-downloads-src]][npm-downloads-href]
[![license][npm-license-src]][npm-license-href]
[![codecov][codecov-src]][codecov-href]
[![size][npm-size-src]][npm-size-href]

Device, OS, and browser detection from User-Agent and CDN headers.
Works in Node.js, browsers, and edge runtimes without framework dependencies.

- ESM with TypeScript types.
- Cloudflare and CloudFront header support.
- Custom detection flags.
- Dependency-free.

_Not affiliated with the [UnJS](https://unjs.io/) organization._

## Install

```bash
npm install undevice
```

## Usage

### Request headers

Create a detector once, then pass each incoming request's headers to `detect()`:

```ts
import { undevice } from "undevice";

const { detect } = undevice();
const device = detect({ headers: request.headers });

device.isMobile;
device.isTablet;
device.isDesktop;
```

`undevice()` returns a frozen object with a `detect` method. Each call to `detect()`
returns a new frozen [UndeviceResult](#undeviceresult) with detection [flags](#result).

The library does not mutate input data or implicitly access request context or browser globals.

### User-Agent

In the browser, pass `navigator.userAgent`:

```ts
import { undevice } from "undevice";

const { detect } = undevice();
const device = detect({ userAgent: navigator.userAgent });
```

To override the User-Agent:

```ts
const device = detect({
  headers: request.headers,
  userAgent: customUserAgent,
});
```

For SSR, reuse the server's result on the client to avoid hydration mismatches.

### Options

`detect(options)` accepts the options below. Pass `{}` without headers
or a User-Agent to get an unknown device type.

```ts
type UndeviceOptions = Readonly<{
  headers?: RequestHeaders;
  userAgent?: string;
}>;
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `headers` | [`RequestHeaders`](#requestheaders) | `undefined` | Request headers. Accepts a standard [`Headers`](https://developer.mozilla.org/en-US/docs/Web/API/Headers) instance or a plain record, including Node.js request headers. |
| `userAgent` | `string` | From `headers` | Used instead of the `user-agent` header value. Also supports standalone UA detection. |

### Result

[`UndeviceResult`](#undeviceresult) contains the following built-in boolean flags:

| Group | Flags |
| --- | --- |
| Device | `isMobile`, `isTablet`, `isDesktop`, `isUnknown` |
| Combined | `isMobileOrTablet`, `isDesktopOrTablet` |
| OS | `isIos`, `isAndroid`, `isWindows`, `isMacOS`, `isLinux`, `isApple` |
| Browser | `isChrome`, `isFirefox`, `isSafari`, `isEdge`, `isSamsung` |

`isUnknown` is `true` when the input does not resolve to a device type.
Custom flags are added to the same result object.

### Custom flags

Pass an object to `undevice()` to add your own flags. Each key becomes a flag name
in the result.

Each value can be:

- A function `(ua: string) => boolean`. It receives the User-Agent trimmed and converted to lowercase.
- An array of strings for case-insensitive substring matching against the User-Agent. The check returns `true` if at least one substring matches. Special characters such as `.` and `*` are treated literally.
- An object with a required `detect` and an optional `exclude`. Both fields accept a function or an array of strings. If `exclude` returns `true`, the flag is set to `false` and `detect` is skipped. Otherwise, the flag takes the result of `detect`.

A check function:

```ts
const { detect } = undevice({
  isCrawler: (ua) => /googlebot/i.test(ua),
});
```

An array of substrings:

```ts
const { detect } = undevice({
  isRawClient: ["curl", "wget"],
});
```

A check with an array of exclusions:

```ts
import { isbot } from "isbot";

const { detect } = undevice({
  isCrawler: {
    detect: isbot,
    exclude: ["curl", "wget"],
  },
});
```

An array of substrings in `detect` and a function in `exclude`:

```ts
const { detect } = undevice({
  isCrawler: {
    detect: ["bot", "crawler", "spider"],
    exclude: (ua) => ua.includes("my-health-checker"),
  },
});
```

#### Examples with third-party libraries

You can use a function from a third-party library as a check or use its data in your own callback. The examples below use `isbot` and `crawler-user-agents`.

**isCrawler with isbot**

Use [isbot](https://github.com/omrilotan/isbot) to identify bot User-Agents:

```bash
npm install isbot
```

```ts
import { isbot } from "isbot";
import { undevice } from "undevice";

const { detect } = undevice({ isCrawler: isbot });
const device = detect({ headers: request.headers });

device.isCrawler; // boolean
```

**isCrawler with crawler-user-agents**

You can also build a check from the patterns in
[crawler-user-agents](https://github.com/monperrus/crawler-user-agents).
Compile the regular expressions once when setting up the detector:

```bash
npm install crawler-user-agents
```

```ts
import crawlers from "crawler-user-agents" with { type: "json" };
import { undevice } from "undevice";

const patterns = crawlers.map(({ pattern }) => new RegExp(pattern, "i"));

const { detect } = undevice({
  isCrawler: (ua) => patterns.some((pattern) => pattern.test(ua)),
});

const device = detect({ headers: request.headers });

device.isCrawler; // boolean
```

### Types

#### UndeviceOptions

Options for `detect`, with optional User-Agent and [request headers](#requestheaders).

```ts
type UndeviceOptions = Readonly<{
  userAgent?: string;
  headers?: RequestHeaders;
}>;
```

#### RequestHeaders

A header record or an object with a `get()` method compatible with standard [`Headers`](https://developer.mozilla.org/en-US/docs/Web/API/Headers):

```ts
type RequestHeaders =
  | Readonly<Record<string, string | readonly string[] | undefined>>
  | Readonly<{ get(name: string): string | null }>;
```

#### UndeviceResult

`UndeviceResult<T>` describes the result of `detect`: built-in [flags](#result)
and readonly boolean flags for each key in the extensions type `T`.
The factory infers `T` from the supplied checks. Without a type argument,
`UndeviceResult` describes a result with no custom flags.

```ts
import type { UndeviceResult } from "undevice";

const extensions = {
  isRawClient: (ua: string) => /curl|wget/i.test(ua),
};

type Device = UndeviceResult<typeof extensions>;
```

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
