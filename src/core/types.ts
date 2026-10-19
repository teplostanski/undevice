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

type PlatformFlags = OsFlags & BrowserFlags

export type FlagDetector = (userAgent: string) => boolean

export type FlagCheck = FlagDetector | readonly string[]

export type FlagExtension =
  | FlagCheck
  | {
      readonly detect: FlagCheck
      readonly exclude?: FlagCheck
    }

export type Extensions = Record<string, FlagExtension>

type ExtensionFlags<T extends Extensions> = {
  readonly [K in keyof T]: boolean
}

export type UndeviceResult<T extends Extensions = Record<never, never>> = DeviceKindFlags &
  PlatformFlags &
  ExtensionFlags<T>
