import { detectBrowserFlags } from './browser.js'
import { resolveCdnHints } from './cdn.js'
import { isCrawlerUserAgent } from './crawler.js'
import { detectDeviceKind, toDeviceKindFlags } from './device-kind.js'
import { normalizeInput } from './normalize.js'
import { detectOsFlags } from './os.js'
import type { UndeviceOptions, UndeviceResult } from './types.js'

export const undevice = (options: UndeviceOptions = {}): UndeviceResult => {
  const { userAgent, headers } = normalizeInput(options)
  const cdn = resolveCdnHints(userAgent, headers)
  const kind = cdn.kind ?? detectDeviceKind(userAgent)

  return Object.freeze({
    ...toDeviceKindFlags(kind),
    ...detectOsFlags(userAgent),
    ...cdn.os,
    ...detectBrowserFlags(userAgent),
    isCrawler: isCrawlerUserAgent(userAgent),
  })
}
