import type { DeviceKindFlags } from './device-kind.js'

export type DeviceHeaders = Readonly<Record<string, string | undefined>>

export type DetectDeviceInput = Readonly<{
  userAgent?: string
  headers?: DeviceHeaders
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
