import { describe, expect, expectTypeOf, it } from 'vitest'
import {
  BrowserName,
  CloudFrontHeader,
  CloudFrontUserAgent,
  CloudflareDeviceType,
  CloudflareHeader,
  DeviceKind,
} from '../src/core/constants.js'
import type { RequestHeaders, UndeviceOptions, UndeviceResult } from '../src/index.js'
import * as publicApi from '../src/index.js'
import { undevice } from '../src/index.js'

describe('public API surface', () => {
  it('exports only undevice at runtime', () => {
    expect(Object.keys(publicApi)).toEqual(['undevice'])
    expectTypeOf<keyof typeof publicApi>().toEqualTypeOf<'undevice'>()
  })

  it('exports options, headers, and result types', () => {
    const detector = undevice({})
    expectTypeOf<Parameters<typeof detector.detect>[0]>().toEqualTypeOf<UndeviceOptions>()
    expectTypeOf<UndeviceOptions['headers']>().toEqualTypeOf<RequestHeaders | undefined>()
    expectTypeOf<ReturnType<typeof detector.detect>>().toEqualTypeOf<
      UndeviceResult<Record<never, never>>
    >()
    expect(Object.isFrozen(detector)).toBe(true)
  })

  it('keeps internal constant tables frozen', () => {
    expect(Object.isFrozen(DeviceKind)).toBe(true)
    expect(Object.isFrozen(BrowserName)).toBe(true)
    expect(Object.isFrozen(CloudflareHeader)).toBe(true)
    expect(Object.isFrozen(CloudflareDeviceType)).toBe(true)
    expect(Object.isFrozen(CloudFrontHeader)).toBe(true)
    expect(Object.isFrozen(CloudFrontUserAgent)).toBe(true)
  })

  it('does not share mutable state across detect calls on one instance', () => {
    const detector = undevice()
    const first = detector.detect({ userAgent: 'Mozilla/5.0 (iPhone)' })
    const second = detector.detect({ userAgent: 'Mozilla/5.0 (Windows NT 10.0)' })

    expect(first).not.toBe(second)
    expect(first.isMobile).toBe(true)
    expect(second.isDesktop).toBe(true)
  })
})
