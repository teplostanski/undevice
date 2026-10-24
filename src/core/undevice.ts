import { detectBrowserFlags } from './browser.js'
import { resolveCdnHints } from './cdn.js'
import { detectDeviceKind, toDeviceKindFlags } from './device-kind.js'
import { createCustomFlags } from './extensions.js'
import { normalizeInput } from './normalize.js'
import { detectOsFlags } from './os.js'
import type { UndeviceExtensions, UndeviceOptions, UndeviceResult } from './types.js'

/**
 * Creates a reusable detector with optional custom boolean flags.
 * Each call to `detect` returns a new frozen result for the supplied request.
 * @param extensions - Named callbacks, substring arrays, or checks with exclusions.
 * @example
 * ```ts
 * const { detect } = undevice({ isRawClient: ['curl', 'wget'] })
 * const device = detect({ userAgent: 'curl/8.0' })
 * ```
 */
export const undevice = <T extends UndeviceExtensions = Record<never, never>>(extensions?: T) => {
  const detect = (options: UndeviceOptions): UndeviceResult<T> => {
    const { userAgent, headers } = normalizeInput(options)
    const cdn = resolveCdnHints(userAgent, headers)
    const kind = cdn.kind ?? detectDeviceKind(userAgent)

    const customFlags = extensions ? createCustomFlags(extensions, userAgent) : null

    return Object.freeze({
      ...toDeviceKindFlags(kind),
      ...detectOsFlags(userAgent),
      ...cdn.os,
      ...detectBrowserFlags(userAgent),
      ...customFlags,
    })
  }

  return Object.freeze({ detect })
}
