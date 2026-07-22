import { describe, expect, it } from 'vitest'
import { detectDevice } from '../src/index.js'
import { userAgents } from './fixtures.js'

const expectExclusiveKind = (
  flags: ReturnType<typeof detectDevice>,
  kind: 'isMobile' | 'isTablet' | 'isDesktop' | 'isUnknown',
) => {
  expect(flags.isMobile).toBe(kind === 'isMobile')
  expect(flags.isTablet).toBe(kind === 'isTablet')
  expect(flags.isDesktop).toBe(kind === 'isDesktop')
  expect(flags.isUnknown).toBe(kind === 'isUnknown')
}

describe('detectDevice', () => {
  it('detects iPhone as mobile', () => {
    const flags = detectDevice({ userAgent: userAgents.iphone })

    expectExclusiveKind(flags, 'isMobile')
    expect(flags.isMobileOrTablet).toBe(true)
    expect(flags.isDesktopOrTablet).toBe(false)
  })

  it('detects iPad as tablet', () => {
    const flags = detectDevice({ userAgent: userAgents.ipad })

    expectExclusiveKind(flags, 'isTablet')
    expect(flags.isMobileOrTablet).toBe(true)
    expect(flags.isDesktopOrTablet).toBe(true)
  })

  it('detects Android phone as mobile', () => {
    expectExclusiveKind(
      detectDevice({ userAgent: userAgents.androidPhone }),
      'isMobile',
    )
  })

  it('detects Android tablet as tablet', () => {
    expectExclusiveKind(
      detectDevice({ userAgent: userAgents.androidTablet }),
      'isTablet',
    )
  })

  it('detects desktop Chrome as desktop', () => {
    const flags = detectDevice({ userAgent: userAgents.desktopChrome })

    expectExclusiveKind(flags, 'isDesktop')
    expect(flags.isMobileOrTablet).toBe(false)
    expect(flags.isDesktopOrTablet).toBe(true)
  })

  it('treats an empty user agent as unknown', () => {
    expectExclusiveKind(detectDevice({}), 'isUnknown')
    expectExclusiveKind(detectDevice({ userAgent: '   ' }), 'isUnknown')
  })

  it('treats unrecognized non-empty user agents as unknown', () => {
    expectExclusiveKind(
      detectDevice({ userAgent: userAgents.garbage }),
      'isUnknown',
    )
  })

  it('is deterministic for the same input', () => {
    const input = { userAgent: userAgents.iphone }

    expect(detectDevice(input)).toEqual(detectDevice(input))
  })
})
