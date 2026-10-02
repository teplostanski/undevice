import { describe, expect, expectTypeOf, it } from 'vitest'
import {
  BrowserName,
  CloudFrontHeader,
  CloudFrontUserAgent,
  CloudflareDeviceType,
  CloudflareHeader,
  DeviceKind,
} from '../src/constants.js'
import type { DetectDeviceInput, DeviceFlags, DeviceHeaders } from '../src/index.js'
import * as publicApi from '../src/index.js'
import { detectDevice } from '../src/index.js'

describe('public API surface', () => {
  it('exports only detectDevice at runtime', () => {
    expect(Object.keys(publicApi)).toEqual(['detectDevice'])
    expectTypeOf<keyof typeof publicApi>().toEqualTypeOf<'detectDevice'>()
  })

  it('exports input, headers, and result types', () => {
    expectTypeOf<Parameters<typeof detectDevice>[0]>().toEqualTypeOf<
      DetectDeviceInput | undefined
    >()
    expectTypeOf<DetectDeviceInput['headers']>().toEqualTypeOf<DeviceHeaders | undefined>()
    expectTypeOf<ReturnType<typeof detectDevice>>().toEqualTypeOf<DeviceFlags>()
  })

  it('keeps internal constant tables frozen', () => {
    expect(Object.isFrozen(DeviceKind)).toBe(true)
    expect(Object.isFrozen(BrowserName)).toBe(true)
    expect(Object.isFrozen(CloudflareHeader)).toBe(true)
    expect(Object.isFrozen(CloudflareDeviceType)).toBe(true)
    expect(Object.isFrozen(CloudFrontHeader)).toBe(true)
    expect(Object.isFrozen(CloudFrontUserAgent)).toBe(true)
  })

  it('does not share mutable state across detectDevice calls', () => {
    const first = detectDevice({ userAgent: 'Mozilla/5.0 (iPhone)' })
    const second = detectDevice({ userAgent: 'Mozilla/5.0 (Windows NT 10.0)' })

    expect(first).not.toBe(second)
    expect(first.isMobile).toBe(true)
    expect(second.isDesktop).toBe(true)
  })
})
