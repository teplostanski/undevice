import { describe, expect, it } from 'vitest'
import { undevice } from '../src/index.js'
import { userAgents } from './fixtures.js'

const expectExclusiveKind = (
  flags: ReturnType<typeof undevice>,
  kind: 'isMobile' | 'isTablet' | 'isDesktop' | 'isUnknown',
) => {
  expect(flags.isMobile).toBe(kind === 'isMobile')
  expect(flags.isTablet).toBe(kind === 'isTablet')
  expect(flags.isDesktop).toBe(kind === 'isDesktop')
  expect(flags.isUnknown).toBe(kind === 'isUnknown')
}

describe('undevice', () => {
  it('detects iPhone as mobile', () => {
    const flags = undevice({ userAgent: userAgents.iphone })

    expectExclusiveKind(flags, 'isMobile')
    expect(flags.isMobileOrTablet).toBe(true)
    expect(flags.isDesktopOrTablet).toBe(false)
  })

  it('detects iPad as tablet', () => {
    const flags = undevice({ userAgent: userAgents.ipad })

    expectExclusiveKind(flags, 'isTablet')
    expect(flags.isMobileOrTablet).toBe(true)
    expect(flags.isDesktopOrTablet).toBe(true)
  })

  it('detects Android phone as mobile', () => {
    expectExclusiveKind(undevice({ userAgent: userAgents.androidPhone }), 'isMobile')
  })

  it('detects Android tablet as tablet', () => {
    expectExclusiveKind(undevice({ userAgent: userAgents.androidTablet }), 'isTablet')
  })

  it('detects desktop Chrome as desktop', () => {
    const flags = undevice({ userAgent: userAgents.desktopChrome })

    expectExclusiveKind(flags, 'isDesktop')
    expect(flags.isMobileOrTablet).toBe(false)
    expect(flags.isDesktopOrTablet).toBe(true)
  })

  it('detects Windows NT without Mozilla as desktop', () => {
    expectExclusiveKind(undevice({ userAgent: userAgents.desktopWindowsNt }), 'isDesktop')
  })

  it('detects Linux without Mozilla as desktop', () => {
    expectExclusiveKind(undevice({ userAgent: userAgents.desktopLinux }), 'isDesktop')
  })

  it('detects PlayBook as tablet', () => {
    expectExclusiveKind(undevice({ userAgent: userAgents.playbook }), 'isTablet')
  })

  it('returns a frozen result object', () => {
    const flags = undevice({ userAgent: userAgents.iphone })

    expect(Object.isFrozen(flags)).toBe(true)
    expect(() => {
      // @ts-expect-error
      flags.isMobile = false
    }).toThrow()
  })

  it('treats an empty user agent as unknown', () => {
    expectExclusiveKind(undevice({}), 'isUnknown')
    expectExclusiveKind(undevice({ userAgent: '   ' }), 'isUnknown')
  })

  it('treats unrecognized non-empty user agents as unknown', () => {
    expectExclusiveKind(undevice({ userAgent: userAgents.garbage }), 'isUnknown')
  })

  it('is deterministic for the same input', () => {
    const input = { userAgent: userAgents.iphone }

    expect(undevice(input)).toEqual(undevice(input))
  })
})
