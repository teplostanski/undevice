import { detectBrowserFlags } from './browser.js'
import { detectDeviceKind, toDeviceKindFlags } from './device-kind.js'
import { normalizeInput } from './normalize.js'
import { detectOsFlags } from './os.js'
import type { DetectDeviceInput, DeviceFlags } from './types.js'

export const detectDevice = (input: DetectDeviceInput = {}): DeviceFlags => {
  const { userAgent } = normalizeInput(input)

  return {
    ...toDeviceKindFlags(detectDeviceKind(userAgent)),
    ...detectOsFlags(userAgent),
    ...detectBrowserFlags(userAgent),
    isCrawler: false,
  }
}
