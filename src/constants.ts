export const DeviceKind = Object.freeze({
  Mobile: 'mobile',
  Tablet: 'tablet',
  Desktop: 'desktop',
  Unknown: 'unknown',
} as const)

export type DeviceKind = typeof DeviceKind[keyof typeof DeviceKind]

export const BrowserName = Object.freeze({
  Samsung: 'Samsung',
  Edge: 'Edge',
  Firefox: 'Firefox',
  Chrome: 'Chrome',
  Safari: 'Safari',
} as const)

export type BrowserName = typeof BrowserName[keyof typeof BrowserName]

export const CloudflareHeader = Object.freeze({
  DeviceType: 'cf-device-type',
} as const)

export type CloudflareHeader = typeof CloudflareHeader[keyof typeof CloudflareHeader]

export const CloudflareDeviceType = Object.freeze({
  Mobile: 'mobile',
  Tablet: 'tablet',
  Desktop: 'desktop',
} as const)

export type CloudflareDeviceType = typeof CloudflareDeviceType[keyof typeof CloudflareDeviceType]

export const CloudFrontHeader = Object.freeze({
  IsMobileViewer: 'cloudfront-is-mobile-viewer',
  IsTabletViewer: 'cloudfront-is-tablet-viewer',
  IsDesktopViewer: 'cloudfront-is-desktop-viewer',
  IsIosViewer: 'cloudfront-is-ios-viewer',
  IsAndroidViewer: 'cloudfront-is-android-viewer',
} as const)

export type CloudFrontHeader = typeof CloudFrontHeader[keyof typeof CloudFrontHeader]

export const CloudFrontUserAgent = Object.freeze({
  AmazonCloudFront: 'Amazon CloudFront',
} as const)

export type CloudFrontUserAgent = typeof CloudFrontUserAgent[keyof typeof CloudFrontUserAgent]
