export type BrowserName = 'Samsung' | 'Edge' | 'Firefox' | 'Chrome' | 'Safari'

export type BrowserFlags = Readonly<{
  isSafari: boolean
  isFirefox: boolean
  isEdge: boolean
  isChrome: boolean
  isSamsung: boolean
}>

const BROWSERS = [
  { name: 'Samsung', pattern: /SamsungBrowser/i },
  { name: 'Edge', pattern: /Edg(?:[eA]|iOS)?\//i },
  { name: 'Firefox', pattern: /Firefox|FxiOS|Iceweasel/i },
  { name: 'Chrome', pattern: /Chrome|CriOS|CrMo/i },
  { name: 'Safari', pattern: /Safari|AppleWebKit/i },
] as const satisfies ReadonlyArray<{
  name: BrowserName
  pattern: RegExp
}>

export const detectBrowserName = (userAgent: string): BrowserName | undefined =>
  BROWSERS.find(({ pattern }) => pattern.test(userAgent))?.name

export const detectBrowserFlags = (userAgent: string): BrowserFlags => {
  const browserName = detectBrowserName(userAgent)

  return {
    isSamsung: browserName === 'Samsung',
    isEdge: browserName === 'Edge',
    isFirefox: browserName === 'Firefox',
    isChrome: browserName === 'Chrome',
    isSafari: browserName === 'Safari',
  }
}
