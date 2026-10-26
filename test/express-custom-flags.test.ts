import express from 'express'
import { expectTypeOf, it } from 'vitest'
import { type UndeviceMiddlewareFlags, undevice } from '../src/express/index.js'

const undeviceMiddleware = undevice({ isRawClient: ['curl', 'wget'] })
type InferredFlags = UndeviceMiddlewareFlags<typeof undeviceMiddleware>

declare module '../src/express/index.js' {
  interface UndeviceCustomFlags extends InferredFlags {
    isBot: boolean
  }
}

it('types manual and inferred middleware custom flags in routes without annotations', () => {
  const app = express()
  app.use(undeviceMiddleware)
  app.get('/device', (_req, res) => {
    expectTypeOf(res.locals.undevice.isMobile).toEqualTypeOf<boolean>()
    expectTypeOf(res.locals.undevice.isBot).toEqualTypeOf<boolean>()
    expectTypeOf(res.locals.undevice.isRawClient).toEqualTypeOf<boolean>()
    // @ts-expect-error Undeclared custom flags must not silently become any.
    res.locals.undevice.isCrawler
    res.json(res.locals.undevice)
  })
})

it('extracts only configured flags and defaults to no custom flags', () => {
  expectTypeOf<InferredFlags>().toEqualTypeOf<{ readonly isRawClient: boolean }>()
  const middleware = undevice()
  expectTypeOf<keyof UndeviceMiddlewareFlags<typeof middleware>>().toEqualTypeOf<never>()
})
