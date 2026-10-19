import { detectBrowserFlags } from './browser.js'
import { resolveCdnHints } from './cdn.js'
import { detectDeviceKind, toDeviceKindFlags } from './device-kind.js'
import { createCustomFlags } from './extensions.js'
import { normalizeInput } from './normalize.js'
import { detectOsFlags } from './os.js'
import type { Extensions, UndeviceOptions, UndeviceResult } from './types.js'

export const undevice = <T extends Extensions = Record<never, never>>(extensions?: T) => {
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
