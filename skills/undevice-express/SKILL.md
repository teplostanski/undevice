---
name: undevice-express
description: Integrate undevice/express middleware into Express applications, configure custom device flags, and type res.locals.undevice through module augmentation. Use when adding or debugging the undevice Express adapter or its route types.
---

# undevice Express

Check the application's installed package exports for `undevice/express` and preserve its existing request flow. The adapter is included in `undevice`; Express `^4.18.0 || ^5.0.0` is an optional peer dependency. Use the installed declarations for version-specific compatibility.

## Middleware

```ts
import express from 'express';
import { undevice } from 'undevice/express';

const app = express();
app.use(undevice());

app.get('/device', (_req, res) => {
  res.json(res.locals.undevice);
});
```

- Register middleware before handlers that read `res.locals.undevice`.
- It reads `req.headers`, including User-Agent and CDN hints, and assigns a new frozen result to `res.locals.undevice` for each request. Other locals are preserved.
- The adapter returns an Express handler, not the core detector object. It has no `.detect()` method and does not populate `req.undevice`.
- Importing the adapter declares built-in flags on `Express.Locals`. This type declaration does not guarantee middleware has executed for a particular route.
- Exceptions from custom checks propagate to Express error handlers.

## Custom flags and route types

Extensions are passed directly to `undevice(...)`. Values can be synchronous boolean callbacks, arrays of case-insensitive literal substrings, or `{ detect, exclude? }` checks. Both object fields accept callbacks or arrays; a matching exclusion returns `false`. Callbacks receive a trimmed, lowercased User-Agent. Keep names distinct from built-in flags and configuration fixed after middleware creation.

Export configured middleware and infer its custom flags with `UndeviceMiddlewareFlags`:

```ts
// app.ts
import express from 'express';
import { undevice } from 'undevice/express';

const app = express();
export const undeviceMiddleware = undevice({
  isRawClient: ['curl', 'wget'],
});

app.use(undeviceMiddleware);
app.get('/device', (_req, res) => {
  res.locals.undevice.isMobile;    // boolean
  res.locals.undevice.isRawClient; // boolean
  res.json(res.locals.undevice);
});
```

```ts
// undevice.d.ts
import type { UndeviceMiddlewareFlags } from 'undevice/express';
import type { undeviceMiddleware } from './app.js';

type Flags = UndeviceMiddlewareFlags<typeof undeviceMiddleware>;

declare module 'undevice/express' {
  interface UndeviceCustomFlags extends Flags {}
}
```

Alternatively, declare custom fields manually:

```ts
import 'undevice/express';

declare module 'undevice/express' {
  interface UndeviceCustomFlags {
    isRawClient: boolean;
  }
}
```

Include the declaration file in the application's TypeScript project. Augment `UndeviceCustomFlags`, not `Express.Locals.undevice` directly. The augmentation applies project-wide; middleware serving those routes must provide the declared flags. Do not widen an inferred middleware variable to `RequestHandler`, which discards its custom flag type information.

## Verification

Use the application's typecheck to verify built-in and custom flags in an unannotated route handler. Check middleware registration order and request-specific results with its existing test tools. For missing custom types, inspect the declaration file's inclusion, module specifier, and inferred middleware type.

[Express documentation](https://undevice.hacks.run/integrations/express)
