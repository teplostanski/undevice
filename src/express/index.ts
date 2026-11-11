import type { RequestHandler } from 'express'
import type {
  UndeviceAdapter,
  UndeviceAdapterFlags,
  UndeviceAdapterResult,
} from '../adapters/types.js'
import { undevice as core, type UndeviceExtensions } from '../index.js'

// Duplicated per adapter so augmentation affects only this adapter's custom flags.
/** Extend this interface in the application to declare its custom boolean flags. */
// biome-ignore lint/suspicious/noEmptyInterface: Public extension point for module augmentation.
export interface UndeviceCustomFlags {}

export type UndeviceMiddleware<T extends UndeviceExtensions = Record<never, never>> =
  UndeviceAdapter<RequestHandler, T>

/** Extracts custom boolean flags from a configured middleware. */
export type UndeviceMiddlewareFlags<T extends RequestHandler> = UndeviceAdapterFlags<T>

declare global {
  namespace Express {
    interface Locals {
      undevice: UndeviceAdapterResult<UndeviceCustomFlags>
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
