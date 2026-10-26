---
layout: home
hero:
  name: undevice
  text: Unified Device Detector
  tagline: Device, OS, and browser detection from headers. Dependency-free, typed, and ready for CDN signals.
  image:
    light: /logo-light.svg
    dark: /logo-dark.svg
    alt: undevice
  actions:
    - theme: brand
      text: Get started
      link: /guide/getting-started
    - theme: alt
      text: Try it live
      link: /playground
    - theme: alt
      text: Integrations
      link: /integrations/
    - theme: alt
      text: GitHub
      link: https://github.com/teplostanski/undevice
features:
  - title: Any runtime
    details: Node.js, browser, or edge. You supply the input; undevice returns the flags.
  - title: Custom flags
    details: Add your own device detection flags with automatic type inference.
  - title: CDN-aware
    details: Cloudflare and CloudFront hints with explicit precedence over User-Agent.
  - title: Integrations
    details: Ready-to-use Express middleware with typed flags in route handlers.
    link: /integrations/
    linkText: Explore integrations
---

::: code-group

```ts twoslash [Basic usage]
import { undevice } from "undevice";

const { detect } = undevice();
const device = detect({ userAgent: navigator.userAgent });

device.isMobile;
device.isDesktop;
device.isWindows;
device.isChrome;
```

```ts twoslash [Custom flags]
// This example uses the third-party library isbot
import { isbot } from "isbot";
import { undevice } from "undevice";

// Configure custom flags
const { detect } = undevice({
  isCrawler: isbot,
  isRawClient: ["curl", "wget"],
});
const device = detect({ userAgent: navigator.userAgent });

device.isMobile;
device.isDesktop;
device.isWindows;
device.isChrome;

// Use custom flags
device.isCrawler;
device.isRawClient;
```

:::
