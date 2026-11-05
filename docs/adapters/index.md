# Adapters

Connect undevice to your server application to detect devices from each request's headers.

## Available adapters

Adapters are included in `undevice` and support CDN headers and typed built-in and custom flags.

| Adapter | Import | Result |
| --- | --- | --- |
| [Express](/adapters/express) | `undevice/express` | `res.locals.undevice` |
| [Fastify](/adapters/fastify) | `undevice/fastify` | `request.undevice` |

## Other frameworks and SSR

The core API accepts headers directly and works with other frameworks without an adapter.
See [Core API and SSR](/guide/adapters) for examples using Express and Fastify, Astro, and Fetch handlers, plus guidance on hydration.
