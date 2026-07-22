import { detectDeviceKind, toDeviceKindFlags } from './device-kind.js'
import { normalizeInput } from './normalize.js'
import type { DetectDeviceInput, DeviceFlags } from './types.js'

const emptyPlatformFlags = {
  isIos: false,
  isAndroid: false,
  isWindows: false,
  isLinux: false,
  isMacOS: false,
  isApple: false,
  isSafari: false,
  isFirefox: false,
  isEdge: false,
  isChrome: false,
  isSamsung: false,
  isCrawler: false,
} as const

export const detectDevice = (input: DetectDeviceInput = {}): DeviceFlags => {
  const { userAgent } = normalizeInput(input)
  const kindFlags = toDeviceKindFlags(detectDeviceKind(userAgent))

  return {
    ...kindFlags,
    ...emptyPlatformFlags,
  }
}
