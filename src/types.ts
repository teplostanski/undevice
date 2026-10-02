import type { BrowserFlags } from './browser.js'
import type { DeviceKindFlags } from './device-kind.js'
import type { OsFlags } from './os.js'

export type DeviceHeaders =
  | Readonly<Record<string, string | readonly string[] | undefined>>
  | Readonly<{ get(name: string): string | null }>

export type DetectDeviceInput = Readonly<{
  userAgent?: string
  headers?: DeviceHeaders
}>

type PlatformFlags = OsFlags &
  BrowserFlags &
  Readonly<{
    isCrawler: boolean
  }>

export type DeviceFlags = DeviceKindFlags & PlatformFlags
