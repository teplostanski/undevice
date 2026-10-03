import type { BrowserFlags } from './browser.js'
import type { DeviceKindFlags } from './device-kind.js'
import type { OsFlags } from './os.js'

export type RequestHeaders =
  | Readonly<Record<string, string | readonly string[] | undefined>>
  | Readonly<{ get(name: string): string | null }>

export type UndeviceOptions = Readonly<{
  userAgent?: string
  headers?: RequestHeaders
}>

type PlatformFlags = OsFlags &
  BrowserFlags &
  Readonly<{
    isCrawler: boolean
  }>

export type UndeviceResult = DeviceKindFlags & PlatformFlags
