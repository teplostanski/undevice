import { describe, expect, it } from 'vitest'
import { detectDevice } from '../src/index.js'
import { userAgents } from './fixtures.js'

describe('CDN header precedence', () => {
  it('uses Cloudflare CF-Device-Type over the user agent', () => {
    const flags = detectDevice({
      userAgent: userAgents.desktopChrome,
      headers: {
        'CF-Device-Type': 'mobile',
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
        'cf-device-type': 'desktop',
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
        'cf-device-type': 'smarttv',
      },
    })

    expect(flags.isMobile).toBe(true)
  })

  it('uses CloudFront viewer headers when the UA is Amazon CloudFront', () => {
    const flags = detectDevice({
      userAgent: userAgents.cloudfront,
      headers: {
        'CloudFront-Is-Mobile-Viewer': 'true',
        'CloudFront-Is-IOS-Viewer': 'true',
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
        'CloudFront-Is-Mobile-Viewer': 'true',
        'CloudFront-Is-Tablet-Viewer': 'true',
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
        'CloudFront-Is-Mobile-Viewer': 'true',
      },
    })

    expect(flags.isDesktop).toBe(true)
    expect(flags.isMobile).toBe(false)
  })

  it('prefers empty-UA Cloudflare hints over unknown', () => {
    const flags = detectDevice({
      headers: {
        'cf-device-type': 'tablet',
      },
    })

    expect(flags).toMatchObject({
      isTablet: true,
      isUnknown: false,
    })
  })
})
