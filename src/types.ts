export type DeviceHeaders = Readonly<Record<string, string | undefined>>

export type DetectDeviceInput = Readonly<{
  userAgent?: string
  headers?: DeviceHeaders
}>

type DeviceKindFlags
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

type PlatformFlags = Readonly<{
  isIos: boolean
  isAndroid: boolean
  isWindows: boolean
  isLinux: boolean
  isMacOS: boolean
  isApple: boolean
  isSafari: boolean
  isFirefox: boolean
  isEdge: boolean
  isChrome: boolean
  isSamsung: boolean
  isCrawler: boolean
}>

export type DeviceFlags = DeviceKindFlags & PlatformFlags
