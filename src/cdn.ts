import {
  CloudflareDeviceType,
  CloudflareHeader,
  CloudFrontHeader,
  CloudFrontUserAgent,
  DeviceKind,
} from './constants.js'
import type { CloudflareDeviceType as CloudflareDeviceTypeValue, DeviceKind as DeviceKindType } from './constants.js'
import type { OsFlags } from './os.js'

export type CdnHints = Readonly<{
  kind?: DeviceKindType
  os?: Partial<OsFlags>
}>

const CloudflareDeviceTypeToKind = {
  [CloudflareDeviceType.Mobile]: DeviceKind.Mobile,
  [CloudflareDeviceType.Tablet]: DeviceKind.Tablet,
  [CloudflareDeviceType.Desktop]: DeviceKind.Desktop,
} as const satisfies Record<CloudflareDeviceTypeValue, DeviceKindType>

const CloudFrontDeviceKindByHeader = {
  [CloudFrontHeader.IsMobileViewer]: DeviceKind.Mobile,
  [CloudFrontHeader.IsTabletViewer]: DeviceKind.Tablet,
  [CloudFrontHeader.IsDesktopViewer]: DeviceKind.Desktop,
} as const satisfies Record<
  typeof CloudFrontHeader.IsMobileViewer
  | typeof CloudFrontHeader.IsTabletViewer
  | typeof CloudFrontHeader.IsDesktopViewer,
  DeviceKindType
>

const CloudFrontOsByHeader = {
  [CloudFrontHeader.IsIosViewer]: {
    isIos: true,
    isApple: true,
  },
  [CloudFrontHeader.IsAndroidViewer]: {
    isAndroid: true,
  },
} as const satisfies Record<
  typeof CloudFrontHeader.IsIosViewer | typeof CloudFrontHeader.IsAndroidViewer,
  Partial<OsFlags>
>

const isTrue = (value: string | undefined): boolean =>
  value === 'true'

const isCloudflareDeviceType = (value: string): value is CloudflareDeviceTypeValue =>
  Object.hasOwn(CloudflareDeviceTypeToKind, value)

const kindFromCloudflare = (deviceType: string): DeviceKindType | undefined => {
  const normalized = deviceType.toLowerCase()
  return isCloudflareDeviceType(normalized)
    ? CloudflareDeviceTypeToKind[normalized]
    : undefined
}

const kindFromCloudFront = (
  headers: Readonly<Record<string, string>>,
): DeviceKindType | undefined => {
  const matchedKinds = (
    Object.entries(CloudFrontDeviceKindByHeader) as Array<[string, DeviceKindType]>
  )
    .filter(([header]) => isTrue(headers[header]))
    .map(([, kind]) => kind)

  return matchedKinds.at(-1)
}

const osFromCloudFront = (
  headers: Readonly<Record<string, string>>,
): Partial<OsFlags> =>
  Object.fromEntries(
    (Object.entries(CloudFrontOsByHeader) as Array<[string, Partial<OsFlags>]>)
      .filter(([header]) => isTrue(headers[header]))
      .flatMap(([, flags]) => Object.entries(flags)),
  )

export const resolveCdnHints = (
  userAgent: string,
  headers: Readonly<Record<string, string>>,
): CdnHints => {
  if (userAgent === CloudFrontUserAgent.AmazonCloudFront) {
    return {
      kind: kindFromCloudFront(headers) ?? DeviceKind.Unknown,
      os: osFromCloudFront(headers),
    }
  }

  const cloudflareType = headers[CloudflareHeader.DeviceType]
  if (cloudflareType !== undefined) {
    const kind = kindFromCloudflare(cloudflareType)
    if (kind !== undefined) {
      return { kind }
    }
  }

  return {}
}
