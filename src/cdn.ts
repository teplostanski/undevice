import type { DeviceKind } from './device-kind.js'
import type { OsFlags } from './os.js'

export type CdnHints = Readonly<{
  kind?: DeviceKind
  os?: Partial<OsFlags>
}>

const CLOUDFRONT_USER_AGENT = 'Amazon CloudFront'

const isTrue = (value: string | undefined): boolean =>
  value === 'true'

const kindFromCloudflare = (deviceType: string): DeviceKind | undefined => {
  switch (deviceType.toLowerCase()) {
    case 'mobile': {
      return 'mobile'
    }
    case 'tablet': {
      return 'tablet'
    }
    case 'desktop': {
      return 'desktop'
    }
    default: {
      return undefined
    }
  }
}

const kindFromCloudFront = (
  headers: Readonly<Record<string, string>>,
): DeviceKind | undefined => {
  // Match nuxt-device override order: mobile → tablet → desktop.
  let kind: DeviceKind | undefined

  if (isTrue(headers['cloudfront-is-mobile-viewer'])) {
    kind = 'mobile'
  }

  if (isTrue(headers['cloudfront-is-tablet-viewer'])) {
    kind = 'tablet'
  }

  if (isTrue(headers['cloudfront-is-desktop-viewer'])) {
    kind = 'desktop'
  }

  return kind
}

const osFromCloudFront = (
  headers: Readonly<Record<string, string>>,
): Partial<OsFlags> => {
  const ios = isTrue(headers['cloudfront-is-ios-viewer'])
  const android = isTrue(headers['cloudfront-is-android-viewer'])

  return {
    ...(ios ? { isIos: true, isApple: true } : {}),
    ...(android ? { isAndroid: true } : {}),
  }
}

export const resolveCdnHints = (
  userAgent: string,
  headers: Readonly<Record<string, string>>,
): CdnHints => {
  if (userAgent === CLOUDFRONT_USER_AGENT) {
    return {
      kind: kindFromCloudFront(headers) ?? 'unknown',
      os: osFromCloudFront(headers),
    }
  }

  const cloudflareType = headers['cf-device-type']
  if (cloudflareType !== undefined) {
    const kind = kindFromCloudflare(cloudflareType)
    if (kind !== undefined) {
      return { kind }
    }
  }

  return {}
}
