export type OsFlags = Readonly<{
  isIos: boolean
  isAndroid: boolean
  isWindows: boolean
  isLinux: boolean
  isMacOS: boolean
  isApple: boolean
}>

const isIos = (userAgent: string): boolean =>
  /iPad|iPhone|iPod/i.test(userAgent)

const isAndroid = (userAgent: string): boolean =>
  /Android/i.test(userAgent)

const isWindows = (userAgent: string): boolean =>
  /Windows/i.test(userAgent)

const isMacOS = (userAgent: string): boolean =>
  /Mac OS X/i.test(userAgent) && !isIos(userAgent)

const isLinux = (userAgent: string): boolean =>
  /Linux/i.test(userAgent) && !isAndroid(userAgent)

export const detectOsFlags = (userAgent: string): OsFlags => {
  const ios = isIos(userAgent)
  const android = isAndroid(userAgent)
  const windows = isWindows(userAgent)
  const macOS = isMacOS(userAgent)
  const linux = isLinux(userAgent)

  return {
    isIos: ios,
    isAndroid: android,
    isWindows: windows,
    isLinux: linux,
    isMacOS: macOS,
    isApple: macOS || ios,
  }
}
