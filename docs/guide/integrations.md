# Core API and SSR

Create the detector outside the request handler and keep each result local to its request. For Express middleware, see [Express](/integrations/express).

## Core API with Express and Fastify

Both expose a Node.js header record as `request.headers`. Use it in your existing route:

```ts
import { undevice } from 'undevice';

const { detect } = undevice();

// Inside an Express or Fastify request handler:
const device = detect({ headers: request.headers });
```

Return the flags, pass them to your template, or store them in the framework's request-local context. Do not put the latest request's result in a shared module variable.

## Astro

Use a server-rendered route to detect the current visitor:

```astro
---
import { undevice } from 'undevice';

export const prerender = false;
const { detect } = undevice();
const device = detect({ headers: Astro.request.headers });
---

<p>Mobile: {String(device.isMobile)}</p>
```

For reuse across routes, export a configured detector from an application module. A prerendered page has no per-visitor headers at build time.

## Fetch handlers

```ts twoslash
import { undevice } from 'undevice';

const { detect } = undevice();

export function handleRequest(request: Request): Response {
  return Response.json(detect({ headers: request.headers }));
}
```

## Hydration

Pass the server result to the client for its first render. Independently detecting on both sides can produce different flags, especially when the server has CDN headers that the browser does not have.

::: tip Device detection is a hint
Use CSS media queries for responsive layout. Use device flags when application behavior specifically needs information about the client. User-Agent strings are supplied by the client and are not authentication signals.
:::
