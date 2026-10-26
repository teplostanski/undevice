# Integrations

Connect undevice to your server application to detect devices from each request's headers.

## Available adapters

| Integration | Import | Features |
| --- | --- | --- |
| [Express](/integrations/express) | `undevice/express` | Middleware writes the result to `res.locals.undevice`. Supports CDN headers and typed built-in and custom flags. |

The Express adapter is included in `undevice`.

## Other frameworks and SSR

The core API accepts headers directly and works with other frameworks without an adapter.
See [Core API and SSR](/guide/integrations) for examples using Express and Fastify, Astro, and Fetch handlers, plus guidance on hydration.
