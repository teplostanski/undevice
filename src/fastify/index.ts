import type { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import type {
  UndeviceAdapter,
  UndeviceAdapterFlags,
  UndeviceAdapterResult,
} from '../adapters/types.js'
import { undevice as core, type UndeviceExtensions } from '../index.js'

export type { UndeviceCustomFlags } from '../adapters/types.js'

export type UndevicePlugin<T extends UndeviceExtensions = Record<never, never>> = UndeviceAdapter<
  FastifyPluginAsync,
  T
>

/** Extracts custom boolean flags from a configured plugin. */
export type UndevicePluginFlags<T extends FastifyPluginAsync> = UndeviceAdapterFlags<T>

declare module 'fastify' {
  interface FastifyRequest {
    undevice: UndeviceAdapterResult
  }
}

export const undevice = <T extends UndeviceExtensions = Record<never, never>>(
  extensions?: T,
): UndevicePlugin<T> => {
  const { detect } = core(extensions)

  const plugin: FastifyPluginAsync = async app => {
    app.decorateRequest('undevice', null, [])

    app.addHook('onRequest', async request => {
      request.undevice = detect({ headers: request.headers }) as UndeviceAdapterResult
    })
  }

  return fp(plugin, { name: 'undevice', fastify: '5.x' })
}
