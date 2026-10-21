---
layout: home
hero:
  name: undevice
  text: Know the device. Bring your own flags.
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
      text: GitHub
      link: https://github.com/teplostanski/undevice
features:
  - title: Any runtime
    details: Node.js, browser, or edge. You supply the input; undevice returns the flags.
  - title: Your checks
    details: Callbacks, substring arrays, and exclusions. Custom flags with inferred types.
  - title: CDN-aware
    details: Cloudflare and CloudFront hints with explicit precedence over User-Agent.
  - title: One detector
    details: Configure once. Get a fresh immutable result for every request.
---

```ts twoslash
import { isbot } from "isbot";
import { undevice } from "undevice";

const { detect } = undevice({
  isCrawler: isbot,
  isRawClient: ["curl", "wget"],
});
const device = detect({ userAgent: navigator.userAgent });

device.isMobile;
device.isDesktop;
device.isWindows;
device.isChrome;
device.isCrawler;
device.isRawClient;
```
