import express from 'express'
import { describe, expect, expectTypeOf, it, vi } from 'vitest'
import { type UndeviceCustomFlags, undevice } from '../src/express/index.js'
import type { UndeviceResult } from '../src/index.js'

const invoke = <T extends ReturnType<typeof undevice>>(
  middleware: T,
  headers: Parameters<T>[0]['headers'],
  locals: Record<string, unknown> = {},
) => {
  const req = { headers } as Parameters<T>[0]
  const res = { locals } as unknown as Parameters<T>[1]
  const next = vi.fn()
  middleware(req, res, next)
  return { req, res, next }
}

describe('Express middleware', () => {
  it.each([
    [{}, 'isUnknown'],
    [{ 'user-agent': 'Mozilla/5.0 (iPhone)' }, 'isMobile'],
    [{ 'user-agent': 'Mozilla/5.0 (Windows NT 10.0)' }, 'isDesktop'],
    [{ 'cf-device-type': 'tablet' }, 'isTablet'],
  ] as const)('detects headers %j', (headers, flag) => {
    const { req, res, next } = invoke(undevice(), headers, { existing: 'value' })
    expect(res.locals.undevice[flag]).toBe(true)
    expect(Object.isFrozen(res.locals.undevice)).toBe(true)
    expect(res.locals).toMatchObject({ existing: 'value' })
    expect(req).toEqual({ headers })
    expect(next).toHaveBeenCalledExactlyOnceWith()
  })

  it('creates independent results with custom flags', () => {
    const middleware = undevice({ isRawClient: ['curl'] })
    const first = invoke(middleware, { 'user-agent': 'curl/8.0' })
    const second = invoke(middleware, {})
    expect(first.res.locals.undevice).not.toBe(second.res.locals.undevice)
    expect(first.res.locals.undevice).toMatchObject({ isRawClient: true })
    expect(second.res.locals.undevice).toMatchObject({ isRawClient: false })
  })

  it('lets Express catch detector errors without advancing the handler chain', () => {
    const error = new Error('Detection failed')
    const middleware = undevice({
      isBroken: () => {
        throw error
      },
    })
    const req = { headers: {} } as Parameters<typeof middleware>[0]
    const res = { locals: {} } as Parameters<typeof middleware>[1]
    const next = vi.fn()
    expect(() => middleware(req, res, next)).toThrow(error)
    expect(next).not.toHaveBeenCalled()
    expect(res.locals).toEqual({})
  })

  it('types res.locals.undevice in routes without annotations', () => {
    const app = express()
    app.use(undevice())
    app.get('/device', (_req, res) => {
      expectTypeOf(res.locals.undevice).toEqualTypeOf<UndeviceResult & UndeviceCustomFlags>()
      expectTypeOf(res.locals.undevice.isMobile).toEqualTypeOf<boolean>()
      // @ts-expect-error Misspelled flags must not be accepted.
      res.locals.undevice.isMoblie
      res.json(res.locals.undevice)
    })
  })
})
