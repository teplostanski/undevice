import { DeviceKind } from './constants.js'

export type { DeviceKind } from './constants.js'

export type DeviceKindFlags
  = | Readonly<{
    isMobile: true
    isTablet: false
    isDesktop: false
    isUnknown: false
    isMobileOrTablet: true
    isDesktopOrTablet: false
  }>
  | Readonly<{
    isMobile: false
    isTablet: true
    isDesktop: false
    isUnknown: false
    isMobileOrTablet: true
    isDesktopOrTablet: true
  }>
  | Readonly<{
    isMobile: false
    isTablet: false
    isDesktop: true
    isUnknown: false
    isMobileOrTablet: false
    isDesktopOrTablet: true
  }>
  | Readonly<{
    isMobile: false
    isTablet: false
    isDesktop: false
    isUnknown: true
    isMobileOrTablet: false
    isDesktopOrTablet: false
  }>

const DeviceKindFlagsByKind = {
  [DeviceKind.Mobile]: {
    isMobile: true,
    isTablet: false,
    isDesktop: false,
    isUnknown: false,
    isMobileOrTablet: true,
    isDesktopOrTablet: false,
  },
  [DeviceKind.Tablet]: {
    isMobile: false,
    isTablet: true,
    isDesktop: false,
    isUnknown: false,
    isMobileOrTablet: true,
    isDesktopOrTablet: true,
  },
  [DeviceKind.Desktop]: {
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isUnknown: false,
    isMobileOrTablet: false,
    isDesktopOrTablet: true,
  },
  [DeviceKind.Unknown]: {
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isUnknown: true,
    isMobileOrTablet: false,
    isDesktopOrTablet: false,
  },
} as const satisfies Record<DeviceKind, DeviceKindFlags>

const isTabletUserAgent = (userAgent: string): boolean =>
  /iPad/i.test(userAgent)
  || /Tablet|PlayBook|Silk/i.test(userAgent)
  || (/Android/i.test(userAgent) && !/Mobile/i.test(userAgent))

const isMobileUserAgent = (userAgent: string): boolean =>
  /iPhone|iPod|Android|Mobile|BlackBerry|IEMobile|Opera Mini|Windows Phone/i.test(userAgent)

const isDesktopUserAgent = (userAgent: string): boolean =>
  /Mozilla\//i.test(userAgent)
  || /Windows NT|Macintosh|Mac OS X|X11|CrOS|WOW64/i.test(userAgent)
  || (/Linux/i.test(userAgent) && !/Android/i.test(userAgent))

export const detectDeviceKind = (userAgent: string): DeviceKind => {
  if (userAgent.length === 0) {
    return DeviceKind.Unknown
  }

  if (isTabletUserAgent(userAgent)) {
    return DeviceKind.Tablet
  }

  if (isMobileUserAgent(userAgent)) {
    return DeviceKind.Mobile
  }

  if (isDesktopUserAgent(userAgent)) {
    return DeviceKind.Desktop
  }

  return DeviceKind.Unknown
}

export const toDeviceKindFlags = (kind: DeviceKind): DeviceKindFlags =>
  DeviceKindFlagsByKind[kind]
