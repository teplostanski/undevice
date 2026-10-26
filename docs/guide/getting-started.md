# Getting started

::: code-group

```sh [npm]
npm install undevice
```

```sh [pnpm]
pnpm add undevice
```

```sh [yarn]
yarn add undevice
```

```sh [bun]
bun add undevice
```

:::

## First detection

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
returns a new frozen [UndeviceResult](/api/type-aliases/UndeviceResult) with detection [flags](/guide/detection#result).

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
