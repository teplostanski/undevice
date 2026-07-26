import { describe, expect, it } from 'vitest'
import {
  CloudflareDeviceType,
  CloudflareHeader,
  CloudFrontHeader,
  detectDevice,
} from '../src/index.js'
import { userAgents } from './fixtures.js'

const cases = [
  {
    name: 'CriOS is Chrome on iPhone, not Safari',
    input: { userAgent: userAgents.chromeIos },
    expected: {
      isMobile: true,
      isIos: true,
      isChrome: true,
      isSafari: false,
    },
  },
  {
    name: 'FxiOS is Firefox on iPhone, not Safari',
    input: { userAgent: userAgents.firefoxIos },
    expected: {
      isMobile: true,
      isIos: true,
      isFirefox: true,
      isSafari: false,
    },
  },
  {
    name: 'EdgiOS is Edge on iPhone, not Safari',
    input: { userAgent: userAgents.edgeIos },
    expected: {
      isMobile: true,
      isIos: true,
      isEdge: true,
      isSafari: false,
      isChrome: false,
    },
  },
  {
    name: 'CrOS is desktop Chrome',
    input: { userAgent: userAgents.chromeOs },
    expected: {
      isDesktop: true,
      isChrome: true,
      isLinux: false,
    },
  },
  {
    name: 'Opera Mini is mobile Android',
    input: { userAgent: userAgents.operaMini },
    expected: {
      isMobile: true,
      isAndroid: true,
    },
  },
  {
    name: 'BlackBerry is mobile',
    input: { userAgent: userAgents.blackberry },
    expected: {
      isMobile: true,
      isDesktop: false,
      isUnknown: false,
    },
  },
  {
    name: 'IEMobile Windows Phone is mobile Windows',
    input: { userAgent: userAgents.ieMobile },
    expected: {
      isMobile: true,
      isWindows: true,
    },
  },
  {
    name: 'Googlebot stays crawler and is not forced to desktop',
    input: { userAgent: userAgents.googlebot },
    expected: {
      isCrawler: true,
      isDesktop: true,
      isUnknown: false,
    },
  },
  {
    name: 'empty UA with Cloudflare tablet is tablet unknown-free',
    input: {
      headers: {
        [CloudflareHeader.DeviceType]: CloudflareDeviceType.Tablet,
      },
    },
    expected: {
      isTablet: true,
      isUnknown: false,
      isCrawler: false,
    },
  },
  {
    name: 'CloudFront Android viewer sets isAndroid without UA OS tokens',
    input: {
      userAgent: userAgents.cloudfront,
      headers: {
        [CloudFrontHeader.IsDesktopViewer]: 'true',
        [CloudFrontHeader.IsAndroidViewer]: 'true',
      },
    },
    expected: {
      isDesktop: true,
      isAndroid: true,
      isIos: false,
    },
  },
] as const

describe('recognition regressions', () => {
  it.each(cases)('$name', ({ input, expected }) => {
    expect(detectDevice(input)).toMatchObject(expected)
  })
})
