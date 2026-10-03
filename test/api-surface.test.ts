import { describe, expect, expectTypeOf, it } from 'vitest'
import {
  BrowserName,
  CloudFrontHeader,
  CloudFrontUserAgent,
  CloudflareDeviceType,
  CloudflareHeader,
  DeviceKind,
} from '../src/constants.js'
import type { RequestHeaders, UndeviceOptions, UndeviceResult } from '../src/index.js'
import * as publicApi from '../src/index.js'
import { undevice } from '../src/index.js'

describe('public API surface', () => {
  it('exports only undevice at runtime', () => {
    expect(Object.keys(publicApi)).toEqual(['undevice'])
    expectTypeOf<keyof typeof publicApi>().toEqualTypeOf<'undevice'>()
  })

  it('exports options, headers, and result types', () => {
    expectTypeOf<Parameters<typeof undevice>[0]>().toEqualTypeOf<UndeviceOptions | undefined>()
    expectTypeOf<UndeviceOptions['headers']>().toEqualTypeOf<RequestHeaders | undefined>()
    expectTypeOf<ReturnType<typeof undevice>>().toEqualTypeOf<UndeviceResult>()
  })

  it('keeps internal constant tables frozen', () => {
    expect(Object.isFrozen(DeviceKind)).toBe(true)
    expect(Object.isFrozen(BrowserName)).toBe(true)
    expect(Object.isFrozen(CloudflareHeader)).toBe(true)
    expect(Object.isFrozen(CloudflareDeviceType)).toBe(true)
    expect(Object.isFrozen(CloudFrontHeader)).toBe(true)
    expect(Object.isFrozen(CloudFrontUserAgent)).toBe(true)
  })

  it('does not share mutable state across undevice calls', () => {
    const first = undevice({ userAgent: 'Mozilla/5.0 (iPhone)' })
    const second = undevice({ userAgent: 'Mozilla/5.0 (Windows NT 10.0)' })

    expect(first).not.toBe(second)
    expect(first.isMobile).toBe(true)
    expect(second.isDesktop).toBe(true)
  })
})
