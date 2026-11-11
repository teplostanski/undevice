---
name: undevice-fastify
description: Use the undevice/fastify plugin into Fastify applications, configure custom device flags, and type request.undevice through module augmentation. Use when adding or debugging the undevice Fastify adapter or its route types.
---

# undevice Fastify

Check the application's installed package exports for `undevice/fastify` and preserve its existing request flow. The adapter is included in `undevice`; Fastify `^5.0.0` is an optional peer dependency. Use the installed declarations for version-specific compatibility.

## Plugin

```ts
import Fastify from 'fastify'
import { undevice } from 'undevice/fastify'

const app = Fastify()
await app.register(undevice())

app.get('/device', async (request, reply) => {
  return reply.send(request.undevice)
})
```

- Register the plugin once in the scope containing the routes that use `request.undevice`, before registering those routes or their plugins. Pass the configured plugin to `app.register` without calling it again.
- The `onRequest` hook reads `request.headers`, including User-Agent and CDN hints, and assigns a new frozen result to `request.undevice` for each request.
- The adapter returns a Fastify plugin, not the core detector object. It has no `.detect()` method.
- Importing the adapter declares built-in flags on `FastifyRequest`. This declaration applies project-wide, while the hook runs in the registration scope and its child scopes. A declaration alone does not guarantee the plugin has run for a route.
- Exceptions from custom checks propagate to Fastify error handling.

## Custom flags and route types

Extensions are passed directly to `undevice(...)`. Values can be synchronous boolean callbacks, arrays of case-insensitive literal substrings, or `{ detect, exclude? }` checks. Both object fields accept callbacks or arrays; a matching exclusion returns `false`. Callbacks receive a trimmed, lowercased User-Agent. Keep names distinct from built-in flags and configuration fixed after plugin creation.

Export a configured plugin and infer its custom flags with `UndevicePluginFlags`:

```ts
// app.ts
import Fastify from 'fastify'
import { undevice } from 'undevice/fastify'

const app = Fastify()
export const undevicePlugin = undevice({
  isRawClient: ['curl', 'wget'],
})

await app.register(undevicePlugin)
app.get('/device', async (request, reply) => {
  request.undevice.isMobile // boolean
  request.undevice.isRawClient // boolean
  return reply.send(request.undevice)
})
```

```ts
// undevice.d.ts
import type { UndevicePluginFlags } from 'undevice/fastify'
import type { undevicePlugin } from './app.js'

type Flags = UndevicePluginFlags<typeof undevicePlugin>

declare module 'undevice/fastify' {
  interface UndeviceCustomFlags extends Flags {}
}
```

Alternatively, declare custom fields manually:

```ts
import 'undevice/fastify'

declare module 'undevice/fastify' {
  interface UndeviceCustomFlags {
    isRawClient: boolean
  }
}
```

Include the declaration file in the application's TypeScript project. Augment `UndeviceCustomFlags`, not `FastifyRequest.undevice` directly. The augmentation applies project-wide; the plugin serving those routes must provide the declared flags. Do not widen an inferred plugin variable to `FastifyPluginAsync`, which discards its custom flag type information.

Keep a top-level import in the declaration file. Without it, `declare module` declares a replacement module and can hide the `undevice` export. The `import type` statements in the inferred example already satisfy this requirement.

## Verification

Use the application's typecheck to verify built-in and custom flags in an unannotated route handler. Check plugin registration scope and order, and request-specific results with the application's existing tests or `app.inject()`. For missing custom types, inspect the declaration file's inclusion, module specifier, and inferred plugin type.

[Fastify documentation](https://undevice.hacks.run/adapters/fastify)
