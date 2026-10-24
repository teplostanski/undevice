---
name: undevice
description: Integrate undevice into JavaScript and TypeScript applications to detect devices, operating systems, and browsers from User-Agent or CDN headers. Use when adding or debugging undevice calls, configuring custom flags and exclusions, or wiring detection into request handlers and SSR.
---

# undevice

Use the application's installed undevice version and existing request flow. This skill describes the factory API introduced in `1.0.0-beta`. Check the project's package manifest, lockfile, and installed declarations before changing an existing integration. Version 0.x uses a different API; do not silently upgrade it or mix the two APIs. For a new installation targeting this API, use the project's package manager and an available 1.x version; `undevice@1.0.0-beta` is the exact version this skill documents.

## Detection

Import the named ESM export and configure a detector once for reuse across requests:

```ts
import { undevice } from 'undevice';

const { detect } = undevice();

// Inside a request handler:
const device = detect({ headers: request.headers });
```

- `undevice(extensions?)` returns a frozen object containing `detect`.
- `detect(options)` returns a new frozen result for each call. Pass `{}` for missing input; the device type is unknown. Do not call `detect()` without an argument.
- `headers` accepts standard `Headers`, Node.js header records, or an object with `get(name): string | null`. Header names are normalized; array values use the first entry.
- `userAgent` accepts a string and overrides the UA from headers, including when it is an empty string. Other headers still participate in CDN detection.
- The effective UA is trimmed and lowercased before all checks, including custom callbacks.
- In browser code, explicitly pass `navigator.userAgent`. Do not read browser globals during server execution.
- The factory does not return device flags directly. There are no `.headers()` or `.userAgent()` chaining methods.

```ts
const device = detect({
  headers: request.headers,
  userAgent: customUserAgent,
});
```

Built-in flags:

| Group | Fields |
| --- | --- |
| Device | `isMobile`, `isTablet`, `isDesktop`, `isUnknown` |
| Combined | `isMobileOrTablet`, `isDesktopOrTablet` |
| OS | `isIos`, `isAndroid`, `isWindows`, `isMacOS`, `isLinux`, `isApple` |
| Browser | `isChrome`, `isFirefox`, `isSafari`, `isEdge`, `isSamsung` |

Unknown UA is not automatically desktop. Do not mutate the result to add application data; create a separate object or configure an extension.

## Custom flags

Pass extensions directly to the factory, without an `extend` wrapper. Each key becomes a boolean flag. Supported values are:

- A synchronous `(ua: string) => boolean` callback.
- An array of literal substrings, matched case-insensitively with OR semantics. Regex syntax in these strings is not interpreted.
- An object with `detect` and optional `exclude`, each accepting a callback or substring array. A matching exclusion returns `false` without running `detect`.

```ts
const { detect } = undevice({
  isCrawler: {
    detect: (ua) => /googlebot|bingbot/i.test(ua),
    exclude: ['my-health-checker'],
  },
  isRawClient: ['curl', 'wget'],
});

const device = detect({ userAgent: 'curl/8.0' });
// device.isRawClient === true
// device.isCrawler === false
```

Use a callback for regex matching. Reused regexes used with `.test()` should not have `g` or `y`, which make repeated tests depend on `lastIndex`. An empty substring array matches nothing; an empty string matches every UA.

Custom flag names should be distinct from built-in names: the current implementation merges custom flags last and overwrites collisions. Treat extension configuration as fixed after creating the detector; it is retained by reference. Callbacks should be synchronous and free of request-shared mutable state. Exceptions from callbacks propagate to the caller.

For third-party bot detection, add the chosen dependency to the consuming application, not to undevice. For example, after installing `isbot`:

```ts
import { isbot } from 'isbot';
import { undevice } from 'undevice';

const { detect } = undevice({
  isCrawler: { detect: isbot, exclude: ['curl', 'wget'] },
});
```

`isCrawler` is a custom flag, not a built-in result field. Bot checks identify UA patterns; they do not authenticate the sender.

## Request handlers and SSR

Use the framework's existing request object as the input boundary:

- Express and Fastify: pass `request.headers` from the handler.
- Astro: pass `Astro.request.headers` in server-rendered code, or `context.request.headers` in middleware/endpoints.
- Fetch-based handlers and edge runtimes: pass `request.headers` directly.

These are application-level integrations. Do not invent imports such as `undevice/express`, `undevice/fastify`, or `undevice/astro`; check installed exports before using an adapter.

Keep the configured detector reusable, but keep each result local to its request. Attach results to framework locals/context only through that framework's supported mechanism, including its TypeScript augmentation when needed. For SSR, pass the server result to the client for the initial render so hydration uses the same flags. Static rendering has no per-visitor request headers; browser detection must run on the client when appropriate to the requested behavior.

## CDN precedence

An explicit UA replaces the UA source, not all CDN hints:

- When the effective UA is `amazon cloudfront`, CloudFront viewer headers determine device type and supported OS hints. Without a true device header, device type is unknown. This branch takes precedence over Cloudflare.
- Otherwise, a recognized `CF-Device-Type` (`mobile`, `tablet`, `desktop`) overrides UA-based device type. Missing or unrecognized values fall back to the UA.
- CloudFront device headers are `CloudFront-Is-Mobile-Viewer`, `CloudFront-Is-Tablet-Viewer`, and `CloudFront-Is-Desktop-Viewer`. OS hints use `CloudFront-Is-IOS-Viewer` and `CloudFront-Is-Android-Viewer`. Their normalized values must be the string `true`.

## TypeScript and verification

Public types are `RequestHeaders`, `UndeviceExtensions`, `UndeviceOptions`, and `UndeviceResult<T>`. Let the factory infer extension keys from the supplied object; use `satisfies UndeviceExtensions` to validate checks without widening their keys. `UndeviceResult` without a type argument describes built-in flags only. Internal types such as `FlagCheck` and `FlagExtension` are not package-root exports in this version.

```ts
const extensions = { isRawClient: ['curl', 'wget'] };
const { detect } = undevice(extensions);
type Device = ReturnType<typeof detect>;
```

Validate the behavior changed in the consuming application: request header extraction, explicit UA precedence, custom matches and exclusions, and reuse across distinct requests. Use its existing typecheck and test commands. Include SSR/client consistency checks when changing rendering behavior.

For version-specific details, use installed declarations and the [project README](https://github.com/teplostanski/undevice#readme). The package is ESM-only and declares Node.js 22+ support; browser and edge targets need ES2022 APIs.
