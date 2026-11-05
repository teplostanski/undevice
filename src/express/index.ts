import type { RequestHandler } from 'express'
import type {
  UndeviceAdapter,
  UndeviceAdapterFlags,
  UndeviceAdapterResult,
} from '../adapters/types.js'
import { undevice as core, type UndeviceExtensions } from '../index.js'

export type { UndeviceCustomFlags } from '../adapters/types.js'

export type UndeviceMiddleware<T extends UndeviceExtensions = Record<never, never>> =
  UndeviceAdapter<RequestHandler, T>

/** Extracts custom boolean flags from a configured middleware. */
export type UndeviceMiddlewareFlags<T extends RequestHandler> = UndeviceAdapterFlags<T>

declare global {
  namespace Express {
    interface Locals {
      undevice: UndeviceAdapterResult
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
