import { describe, expect, it } from 'vitest'
import {
  CloudflareDeviceType,
  CloudflareHeader,
  CloudFrontHeader,
  detectDevice,
} from '../src/index.js'
import { userAgents } from './fixtures.js'

describe('CDN header precedence', () => {
  it('uses Cloudflare CF-Device-Type over the user agent', () => {
    const flags = detectDevice({
      userAgent: userAgents.desktopChrome,
      headers: {
        [CloudflareHeader.DeviceType]: CloudflareDeviceType.Mobile,
      },
    })

    expect(flags).toMatchObject({
      isMobile: true,
      isTablet: false,
      isDesktop: false,
      isUnknown: false,
      isWindows: true,
      isChrome: true,
    })
  })

  it('accepts Cloudflare headers case-insensitively', () => {
    const flags = detectDevice({
      userAgent: userAgents.iphone,
      headers: {
        'CF-Device-Type': CloudflareDeviceType.Desktop,
      },
    })

    expect(flags).toMatchObject({
      isDesktop: true,
      isMobile: false,
      isIos: true,
    })
  })

  it('falls back to the user agent for unknown Cloudflare values', () => {
    const flags = detectDevice({
      userAgent: userAgents.iphone,
      headers: {
        [CloudflareHeader.DeviceType]: 'smarttv',
      },
    })

    expect(flags.isMobile).toBe(true)
  })

  it('uses CloudFront viewer headers when the UA is Amazon CloudFront', () => {
    const flags = detectDevice({
      userAgent: userAgents.cloudfront,
      headers: {
        [CloudFrontHeader.IsMobileViewer]: 'true',
        [CloudFrontHeader.IsIosViewer]: 'true',
      },
    })

    expect(flags).toMatchObject({
      isMobile: true,
      isTablet: false,
      isDesktop: false,
      isIos: true,
      isApple: true,
      isAndroid: false,
    })
  })

  it('lets CloudFront tablet override mobile', () => {
    const flags = detectDevice({
      userAgent: userAgents.cloudfront,
      headers: {
        [CloudFrontHeader.IsMobileViewer]: 'true',
        [CloudFrontHeader.IsTabletViewer]: 'true',
      },
    })

    expect(flags).toMatchObject({
      isMobile: false,
      isTablet: true,
      isDesktop: false,
    })
  })

  it('treats CloudFront without viewer hints as unknown', () => {
    const flags = detectDevice({
      userAgent: userAgents.cloudfront,
    })

    expect(flags.isUnknown).toBe(true)
  })

  it('does not apply CloudFront headers for regular user agents', () => {
    const flags = detectDevice({
      userAgent: userAgents.desktopChrome,
      headers: {
        [CloudFrontHeader.IsMobileViewer]: 'true',
      },
    })

    expect(flags.isDesktop).toBe(true)
    expect(flags.isMobile).toBe(false)
  })

  it('prefers empty-UA Cloudflare hints over unknown', () => {
    const flags = detectDevice({
      headers: {
        [CloudflareHeader.DeviceType]: CloudflareDeviceType.Tablet,
      },
    })

    expect(flags).toMatchObject({
      isTablet: true,
      isUnknown: false,
    })
  })
})
