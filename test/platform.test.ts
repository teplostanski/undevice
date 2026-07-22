import { describe, expect, it } from 'vitest'
import { detectDevice } from '../src/index.js'
import { userAgents } from './fixtures.js'

describe('OS and browser flags', () => {
  it('detects iPhone as iOS Safari on Apple', () => {
    const flags = detectDevice({ userAgent: userAgents.iphone })

    expect(flags).toMatchObject({
      isIos: true,
      isAndroid: false,
      isMacOS: false,
      isApple: true,
      isSafari: true,
      isChrome: false,
    })
  })

  it('detects Android Chrome phone', () => {
    const flags = detectDevice({ userAgent: userAgents.androidPhone })

    expect(flags).toMatchObject({
      isAndroid: true,
      isLinux: false,
      isChrome: true,
      isSafari: false,
    })
  })

  it('detects Windows Chrome desktop', () => {
    const flags = detectDevice({ userAgent: userAgents.desktopChrome })

    expect(flags).toMatchObject({
      isWindows: true,
      isChrome: true,
      isEdge: false,
      isSafari: false,
    })
  })

  it('detects Linux Firefox desktop', () => {
    const flags = detectDevice({ userAgent: userAgents.desktopFirefox })

    expect(flags).toMatchObject({
      isLinux: true,
      isFirefox: true,
      isChrome: false,
    })
  })

  it('detects macOS Safari desktop', () => {
    const flags = detectDevice({ userAgent: userAgents.desktopSafari })

    expect(flags).toMatchObject({
      isMacOS: true,
      isApple: true,
      isIos: false,
      isSafari: true,
      isChrome: false,
    })
  })

  it('detects Edge before Chrome', () => {
    const flags = detectDevice({ userAgent: userAgents.desktopEdge })

    expect(flags).toMatchObject({
      isWindows: true,
      isEdge: true,
      isChrome: false,
    })
  })

  it('detects Samsung Internet before Chrome', () => {
    const flags = detectDevice({ userAgent: userAgents.samsungBrowser })

    expect(flags).toMatchObject({
      isAndroid: true,
      isSamsung: true,
      isChrome: false,
    })
  })
})
