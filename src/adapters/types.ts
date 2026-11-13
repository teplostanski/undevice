import type { UndeviceExtensions, UndeviceResult } from '../core/types.js'

declare const customFlags: unique symbol

export type UndeviceAdapter<Handler, T extends UndeviceExtensions> = Handler & {
  readonly [customFlags]?: { readonly [K in keyof T]: boolean }
}

export type UndeviceAdapterFlags<T> = T extends {
  readonly [customFlags]?: infer Flags
}
  ? NonNullable<Flags>
  : never

export type UndeviceAdapterResult<CustomFlags> = UndeviceResult & CustomFlags
