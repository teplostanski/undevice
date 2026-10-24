import type { BrowserFlags } from './browser.js'
import type { DeviceKindFlags } from './device-kind.js'
import type { OsFlags } from './os.js'

/** Standard Headers, a compatible reader, or a Node.js-style header record. */
export type RequestHeaders =
  | Readonly<Record<string, string | readonly string[] | undefined>>
  | Readonly<{ get(name: string): string | null }>

/** Input for one detection call. An explicit UA overrides the UA header. */
export type UndeviceOptions = Readonly<{
  /** Trimmed and lowercased before detection and custom callbacks. */
  userAgent?: string
  /** Request headers, including optional CDN hints. */
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

/** Custom flag checks keyed by flag name. Use `satisfies` to preserve inferred keys. */
export type UndeviceExtensions = Record<string, FlagExtension>

type ExtensionFlags<T extends UndeviceExtensions> = {
  readonly [K in keyof T]: boolean
}

/** Immutable built-in flags plus boolean flags inferred from extension keys. */
export type UndeviceResult<T extends UndeviceExtensions = Record<never, never>> = DeviceKindFlags &
  PlatformFlags &
  ExtensionFlags<T>
