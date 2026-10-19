import { describe, expect, it } from 'vitest'
import { CloudFrontHeader, CloudflareDeviceType, CloudflareHeader } from '../src/core/constants.js'
import { undevice } from '../src/index.js'
import { userAgents } from './fixtures.js'

describe('conflicting user-agent tokens', () => {
  it('keeps iPhone as iOS Safari, not macOS', () => {
    const flags = undevice().detect({ userAgent: userAgents.iphone })

    expect(flags).toMatchObject({
      isMobile: true,
      isIos: true,
      isMacOS: false,
      isApple: true,
      isSafari: true,
      isChrome: false,
    })
  })

  it('keeps iPad as tablet even when Mobile is present', () => {
    const flags = undevice().detect({ userAgent: userAgents.ipad })

    expect(flags).toMatchObject({
      isTablet: true,
      isMobile: false,
      isIos: true,
      isMacOS: false,
    })
  })

  it('prefers Edge over Chrome when both tokens are present', () => {
    const flags = undevice().detect({ userAgent: userAgents.desktopEdge })

    expect(flags).toMatchObject({
      isEdge: true,
      isChrome: false,
      isSafari: false,
    })
  })

  it('prefers Samsung Internet over Chrome when both tokens are present', () => {
    const flags = undevice().detect({ userAgent: userAgents.samsungBrowser })

    expect(flags).toMatchObject({
      isSamsung: true,
      isChrome: false,
      isSafari: false,
    })
  })

  it('prefers Chrome over Safari when both tokens are present', () => {
    const flags = undevice().detect({ userAgent: userAgents.desktopChrome })

    expect(flags).toMatchObject({
      isChrome: true,
      isSafari: false,
    })
  })

  it('classifies Android without Mobile as tablet, not phone', () => {
    const flags = undevice().detect({ userAgent: userAgents.androidTablet })

    expect(flags).toMatchObject({
      isTablet: true,
      isMobile: false,
      isAndroid: true,
    })
  })

  it('classifies Kindle Silk as tablet despite Android token', () => {
    const flags = undevice().detect({ userAgent: userAgents.kindleSilk })

    expect(flags).toMatchObject({
      isTablet: true,
      isMobile: false,
      isAndroid: true,
    })
  })

  it('classifies Windows Phone Edge as mobile with Windows and Android tokens', () => {
    const flags = undevice().detect({ userAgent: userAgents.windowsPhone })

    expect(flags).toMatchObject({
      isMobile: true,
      isWindows: true,
      isAndroid: true,
      isEdge: true,
      isChrome: false,
    })
  })

  it('classifies Opera Mini as mobile despite Android-without-Mobile shape', () => {
    const flags = undevice().detect({ userAgent: userAgents.operaMini })

    expect(flags).toMatchObject({
      isMobile: true,
      isTablet: false,
      isAndroid: true,
    })
  })
})

describe('conflicting CDN signals', () => {
  it('prefers CloudFront viewer headers over CF-Device-Type for CloudFront UA', () => {
    const flags = undevice().detect({
      userAgent: userAgents.cloudfront,
      headers: {
        [CloudflareHeader.DeviceType]: CloudflareDeviceType.Desktop,
        [CloudFrontHeader.IsMobileViewer]: 'true',
      },
    })

    expect(flags).toMatchObject({
      isMobile: true,
      isDesktop: false,
      isUnknown: false,
    })
  })

  it('prefers CF-Device-Type over CloudFront headers for regular UA', () => {
    const flags = undevice().detect({
      userAgent: userAgents.desktopChrome,
      headers: {
        [CloudflareHeader.DeviceType]: CloudflareDeviceType.Mobile,
        [CloudFrontHeader.IsDesktopViewer]: 'true',
      },
    })

    expect(flags).toMatchObject({
      isMobile: true,
      isDesktop: false,
    })
  })

  it('lets the last true CloudFront device header win', () => {
    const flags = undevice().detect({
      userAgent: userAgents.cloudfront,
      headers: {
        [CloudFrontHeader.IsMobileViewer]: 'true',
        [CloudFrontHeader.IsDesktopViewer]: 'true',
      },
    })

    expect(flags).toMatchObject({
      isMobile: false,
      isTablet: false,
      isDesktop: true,
    })
  })
})
