# Fastify

Supports Fastify `^5.0.0`.

Import `undevice` from `undevice/fastify` and register `await app.register(undevice())` before
your routes. Each request gets a fresh frozen result in `request.undevice`.
Importing the adapter automatically types built-in flags in route handlers.

## Setup

```ts
import Fastify from 'fastify';
import { undevice } from 'undevice/fastify';

const app = Fastify();
await app.register(undevice());

app.get('/device', async (request, reply) => {
  request.undevice.isMobile; // boolean
  return reply.send(request.undevice);
});
```

## Custom flag types

Extend `UndeviceCustomFlags` to type custom flags in Fastify routes.

**Manual declarations**

Declare custom flag names with the type `boolean`.
Include only flags passed to the plugin configuration:

::: code-group

```ts [undevice.d.ts]
import 'undevice/fastify';

declare module 'undevice/fastify' {
  interface UndeviceCustomFlags {
    isCustomFlag: boolean;
    isAnotherCustomFlag: boolean;
  }
}
```

:::

**Inference from a plugin**

`UndevicePluginFlags<typeof undevicePlugin>` extracts custom flag types
from the configured plugin:

::: code-group

```ts [app.ts]
import Fastify from 'fastify';
import { undevice } from 'undevice/fastify';

const app = Fastify();
export const undevicePlugin = undevice({
  isBot: ['bot'],
  isRawClient: ['curl', 'wget'],
});

await app.register(undevicePlugin);

app.get('/device', async (request, reply) => {
  request.undevice.isMobile;    // boolean
  request.undevice.isBot;       // boolean
  request.undevice.isRawClient; // boolean
  return reply.send(request.undevice);
});
```

```ts [undevice.d.ts]
import type { UndevicePluginFlags } from 'undevice/fastify';
import type { undevicePlugin } from './app.js';

type Flags = UndevicePluginFlags<typeof undevicePlugin>;

declare module 'undevice/fastify' {
  interface UndeviceCustomFlags extends Flags {}
}
```

:::

Include `undevice.d.ts` in the application's TypeScript project. The augmentation
applies to all Fastify routes in that project.
