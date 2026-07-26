import { describe, expect, it } from 'vitest'
import {
  BrowserName,
  CloudflareDeviceType,
  CloudflareHeader,
  CloudFrontHeader,
  CloudFrontUserAgent,
  DeviceKind,
  detectDevice,
} from '../src/index.js'

describe('public API surface', () => {
  it('exports frozen constant tables', () => {
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
