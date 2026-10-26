# Express

Supports Express `^4.18.0 || ^5.0.0`.

Import `undevice` from `undevice/express` and register `app.use(undevice())` before
your routes. Each request gets a fresh frozen result in `res.locals.undevice`.
Importing the adapter automatically types built-in flags in route handlers.

## Setup

```ts
import express from 'express';
import { undevice } from 'undevice/express';

const app = express();
app.use(undevice());

app.get('/device', (_req, res) => {
  res.locals.undevice.isMobile; // boolean
  res.json(res.locals.undevice);
});
```

## Custom flag types

Extend `UndeviceCustomFlags` to type custom flags in Express routes.

**Manual declarations**

Declare custom flag names with the type `boolean`.
Include only flags passed to the middleware configuration:

::: code-group

```ts [undevice.d.ts]
import 'undevice/express';

declare module 'undevice/express' {
  interface UndeviceCustomFlags {
    isCustomFlag: boolean;
    isAnotherCustomFlag: boolean;
  }
}
```

:::

**Inference from middleware**

`UndeviceMiddlewareFlags<typeof undeviceMiddleware>` extracts custom flag types
from the configured middleware:

::: code-group

```ts [app.ts]
import express from 'express';
import { undevice } from 'undevice/express';

const app = express();
export const undeviceMiddleware = undevice({
  isBot: ['bot'],
  isRawClient: ['curl', 'wget'],
});

app.use(undeviceMiddleware);

app.get('/device', (_req, res) => {
  res.locals.undevice.isMobile;    // boolean
  res.locals.undevice.isBot;       // boolean
  res.locals.undevice.isRawClient; // boolean
  res.json(res.locals.undevice);
});
```

```ts [undevice.d.ts]
import type { UndeviceMiddlewareFlags } from 'undevice/express';
import type { undeviceMiddleware } from './app.js';

type Flags = UndeviceMiddlewareFlags<typeof undeviceMiddleware>;

declare module 'undevice/express' {
  interface UndeviceCustomFlags extends Flags {}
}
```

:::

Include `undevice.d.ts` in the application's TypeScript project. The augmentation
applies to all Express routes in that project.
