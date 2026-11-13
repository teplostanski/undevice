import type { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
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

export type UndevicePlugin<T extends UndeviceExtensions = Record<never, never>> = UndeviceAdapter<
  FastifyPluginAsync,
  T
>

/** Extracts custom boolean flags from a configured plugin. */
export type UndevicePluginFlags<T extends FastifyPluginAsync> = UndeviceAdapterFlags<T>

declare module 'fastify' {
  interface FastifyRequest {
    undevice: UndeviceAdapterResult<UndeviceCustomFlags>
  }
}

export const undevice = <T extends UndeviceExtensions = Record<never, never>>(
  extensions?: T,
): UndevicePlugin<T> => {
  const { detect } = core(extensions)

  const plugin: FastifyPluginAsync = async app => {
    app.decorateRequest('undevice', null, [])

    app.addHook('onRequest', async request => {
      request.undevice = detect({
        headers: request.headers,
      }) as UndeviceAdapterResult<UndeviceCustomFlags>
    })
  }

  return fp(plugin, { name: 'undevice', fastify: '5.x' })
}
