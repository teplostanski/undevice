# Custom flags

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

## Type inference

```ts twoslash
import { undevice } from "undevice";

const { detect } = undevice({ isRawClient: ["curl", "wget"] });
const device = detect({ userAgent: "curl/8.0" });
device.isRawClient;
//     ^?
```
