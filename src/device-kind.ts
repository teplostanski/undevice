export type DeviceKind = 'mobile' | 'tablet' | 'desktop' | 'unknown'

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

const DEVICE_KIND_FLAGS = {
  mobile: {
    isMobile: true,
    isTablet: false,
    isDesktop: false,
    isUnknown: false,
    isMobileOrTablet: true,
    isDesktopOrTablet: false,
  },
  tablet: {
    isMobile: false,
    isTablet: true,
    isDesktop: false,
    isUnknown: false,
    isMobileOrTablet: true,
    isDesktopOrTablet: true,
  },
  desktop: {
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isUnknown: false,
    isMobileOrTablet: false,
    isDesktopOrTablet: true,
  },
  unknown: {
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
    return 'unknown'
  }

  // iPad UAs often include "Mobile"; check tablets before phones.
  if (isTabletUserAgent(userAgent)) {
    return 'tablet'
  }

  if (isMobileUserAgent(userAgent)) {
    return 'mobile'
  }

  if (isDesktopUserAgent(userAgent)) {
    return 'desktop'
  }

  return 'unknown'
}

export const toDeviceKindFlags = (kind: DeviceKind): DeviceKindFlags =>
  DEVICE_KIND_FLAGS[kind]
