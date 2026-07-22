import { BrowserName } from './constants.js'
import type { BrowserName as BrowserNameType } from './constants.js'

export type { BrowserName } from './constants.js'

export type BrowserFlags = Readonly<{
  isSafari: boolean
  isFirefox: boolean
  isEdge: boolean
  isChrome: boolean
  isSamsung: boolean
}>

const BrowserPatternByName = {
  [BrowserName.Samsung]: /SamsungBrowser/i,
  [BrowserName.Edge]: /Edg(?:[eA]|iOS)?\//i,
  [BrowserName.Firefox]: /Firefox|FxiOS|Iceweasel/i,
  [BrowserName.Chrome]: /Chrome|CriOS|CrMo/i,
  [BrowserName.Safari]: /Safari|AppleWebKit/i,
} as const satisfies Record<BrowserNameType, RegExp>

const BrowserFlagsByName = {
  [BrowserName.Samsung]: {
    isSamsung: true,
    isEdge: false,
    isFirefox: false,
    isChrome: false,
    isSafari: false,
  },
  [BrowserName.Edge]: {
    isSamsung: false,
    isEdge: true,
    isFirefox: false,
    isChrome: false,
    isSafari: false,
  },
  [BrowserName.Firefox]: {
    isSamsung: false,
    isEdge: false,
    isFirefox: true,
    isChrome: false,
    isSafari: false,
  },
  [BrowserName.Chrome]: {
    isSamsung: false,
    isEdge: false,
    isFirefox: false,
    isChrome: true,
    isSafari: false,
  },
  [BrowserName.Safari]: {
    isSamsung: false,
    isEdge: false,
    isFirefox: false,
    isChrome: false,
    isSafari: true,
  },
} as const satisfies Record<BrowserNameType, BrowserFlags>

const EmptyBrowserFlags = {
  isSamsung: false,
  isEdge: false,
  isFirefox: false,
  isChrome: false,
  isSafari: false,
} as const satisfies BrowserFlags

export const detectBrowserName = (userAgent: string): BrowserNameType | undefined =>
  (Object.entries(BrowserPatternByName) as Array<[BrowserNameType, RegExp]>)
    .find(([, pattern]) => pattern.test(userAgent))
    ?.[0]

export const detectBrowserFlags = (userAgent: string): BrowserFlags => {
  const browserName = detectBrowserName(userAgent)
  return browserName === undefined
    ? EmptyBrowserFlags
    : BrowserFlagsByName[browserName]
}
