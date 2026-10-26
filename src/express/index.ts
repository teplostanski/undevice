import type { RequestHandler } from 'express'
import { undevice as core, type UndeviceExtensions, type UndeviceResult } from '../index.js'

/** Extend this interface in the application to declare its custom boolean flags. */
// biome-ignore lint/suspicious/noEmptyInterface: Public extension point for module augmentation.
export interface UndeviceCustomFlags {}

declare const customFlags: unique symbol

/** Carries custom flag types without adding properties at runtime. */
export type UndeviceMiddleware<T extends UndeviceExtensions = Record<never, never>> =
  RequestHandler & {
    readonly [customFlags]?: { readonly [K in keyof T]: boolean }
  }

/** Extracts custom boolean flags from a configured middleware. */
export type UndeviceMiddlewareFlags<T extends RequestHandler> = T extends {
  readonly [customFlags]?: infer Flags
}
  ? NonNullable<Flags>
  : never

declare global {
  namespace Express {
    interface Locals {
      undevice: UndeviceResult & UndeviceCustomFlags
    }
  }
}

export const undevice = <T extends UndeviceExtensions = Record<never, never>>(
  extensions?: T,
): UndeviceMiddleware<T> => {
  const { detect } = core(extensions)
  return (req, res, next) => {
    res.locals.undevice = detect({ headers: req.headers }) as Express.Locals['undevice']
    next()
  }
}
