import { detectBrowserFlags } from './browser.js'
import { resolveCdnHints } from './cdn.js'
import { isCrawlerUserAgent } from './crawler.js'
import { detectDeviceKind, toDeviceKindFlags } from './device-kind.js'
import { normalizeInput } from './normalize.js'
import { detectOsFlags } from './os.js'
import type { DetectDeviceInput, DeviceFlags } from './types.js'

export const detectDevice = (input: DetectDeviceInput = {}): DeviceFlags => {
  const { userAgent, headers } = normalizeInput(input)
  const cdn = resolveCdnHints(userAgent, headers)
  const kind = cdn.kind ?? detectDeviceKind(userAgent)

  return {
    ...toDeviceKindFlags(kind),
    ...detectOsFlags(userAgent),
    ...cdn.os,
    ...detectBrowserFlags(userAgent),
    isCrawler: isCrawlerUserAgent(userAgent),
  }
}
