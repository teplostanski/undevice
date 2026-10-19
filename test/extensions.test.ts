import { describe, expect, expectTypeOf, it, vi } from 'vitest'
import type { FlagExtension } from '../src/core/types.js'
import { undevice } from '../src/index.js'

describe('custom flags', () => {
  it.each([undefined, {}])('omits crawler detection without extensions: %s', extensions => {
    const flags = undevice(extensions).detect({ userAgent: 'Googlebot' })
    expect(flags).not.toHaveProperty('isCrawler')
  })

  it.each([
    ['Googlebot', true, false],
    ['curl/8.0', false, true],
    ['Mozilla/5.0 (iPhone)', false, false],
    ['', false, false],
  ] as const)('evaluates custom flags for %s', (userAgent, isCrawler, isRawClient) => {
    const detector = undevice({
      isCrawler: (ua: string) => /Googlebot/i.test(ua),
      isRawClient: (ua: string) => /curl|wget/i.test(ua),
    })
    const flags = detector.detect({ userAgent })
    expect(flags).toMatchObject({ isCrawler, isRawClient })
    expect(Object.isFrozen(flags)).toBe(true)
    expectTypeOf(flags.isCrawler).toEqualTypeOf<boolean>()
    expectTypeOf(flags.isRawClient).toEqualTypeOf<boolean>()
    expectTypeOf<'isMissing'>().not.toExtend<keyof typeof flags>()
  })

  it.each([
    [{ headers: { 'user-agent': ' curl ' } }, 'curl'],
    [{ headers: { 'user-agent': 'curl' }, userAgent: ' wget ' }, 'wget'],
    [{}, ''],
  ])('passes the normalized effective UA to extensions: %j', (input, expected) => {
    const detectFlag = vi.fn(() => true)
    const { detect } = undevice({ isCustom: detectFlag })
    expect(detectFlag).not.toHaveBeenCalled()
    expect(detect(input).isCustom).toBe(true)
    expect(detectFlag).toHaveBeenCalledExactlyOnceWith(expected)
  })

  it('does not infer custom keys when extensions are omitted', () => {
    const flags = undevice().detect({})
    expectTypeOf<'isMissing'>().not.toExtend<keyof typeof flags>()
  })

  it.each<{ name: string; extension: FlagExtension; expected: boolean }>([
    { name: 'short array', extension: ['CURL'], expected: true },
    { name: 'empty array', extension: [], expected: false },
    { name: 'object with array', extension: { detect: ['CURL'] }, expected: true },
    { name: 'object with callback', extension: { detect: ua => ua === 'curl/8' }, expected: true },
    {
      name: 'matching exclusion array',
      extension: { detect: () => true, exclude: ['CURL'] },
      expected: false,
    },
    {
      name: 'matching exclusion callback',
      extension: { detect: ['curl'], exclude: ua => ua.includes('curl') },
      expected: false,
    },
    {
      name: 'nonmatching exclusion array',
      extension: { detect: ['curl'], exclude: ['wget'] },
      expected: true,
    },
    {
      name: 'nonmatching exclusion callback',
      extension: { detect: ['curl'], exclude: () => false },
      expected: true,
    },
    { name: 'empty exclusion array', extension: { detect: ['curl'], exclude: [] }, expected: true },
    { name: 'nonmatching detector', extension: { detect: ['wget'], exclude: [] }, expected: false },
  ])('handles $name', ({ extension, expected }) => {
    const flags = undevice({ isCustom: extension }).detect({ userAgent: ' CURL/8 ' })
    expect(flags.isCustom).toBe(expected)
    expectTypeOf(flags.isCustom).toEqualTypeOf<boolean>()
  })

  it.each([['curl'], (ua: string) => ua.includes('curl')])(
    'does not call the detector when excluded: %s',
    exclude => {
      const detectFlag = vi.fn(() => true)
      const flags = undevice({ isCustom: { detect: detectFlag, exclude } }).detect({
        userAgent: 'curl',
      })
      expect(flags.isCustom).toBe(false)
      expect(detectFlag).not.toHaveBeenCalled()
    },
  )

  it('keeps results independent when reusing a detector', () => {
    const { detect } = undevice({ isRawClient: (ua: string) => /curl/i.test(ua) })
    const first = detect({ userAgent: 'curl' })
    const second = detect({ userAgent: 'Mozilla/5.0 (iPhone)' })
    expect(first.isRawClient).toBe(true)
    expect(second.isRawClient).toBe(false)
    expect(second.isMobile).toBe(true)
    expect(first).not.toBe(second)
  })
})
