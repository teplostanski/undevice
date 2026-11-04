import type { UndeviceExtensions, UndeviceResult } from '../core/types.js'

/** Extend this interface in the application to declare its custom boolean flags. */
// biome-ignore lint/suspicious/noEmptyInterface: Public extension point for module augmentation.
export interface UndeviceCustomFlags {}

declare const customFlags: unique symbol

export type UndeviceAdapter<Handler, T extends UndeviceExtensions> = Handler & {
  readonly [customFlags]?: { readonly [K in keyof T]: boolean }
}

export type UndeviceAdapterFlags<T> = T extends {
  readonly [customFlags]?: infer Flags
}
  ? NonNullable<Flags>
  : never

export type UndeviceAdapterResult = UndeviceResult & UndeviceCustomFlags
