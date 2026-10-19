import { describe, expect, it } from 'vitest'
import { undevice } from '../src/index.js'
import { userAgents } from './fixtures.js'

describe('unknown user agents', () => {
  it.each([
    ['empty object', {}],
    ['whitespace UA', { userAgent: '   ' }],
  ] as const)('treats %s as unknown', (_label, input) => {
    const flags = undevice().detect(input)

    expect(flags).toMatchObject({
      isMobile: false,
      isTablet: false,
      isDesktop: false,
      isUnknown: true,
      isMobileOrTablet: false,
      isDesktopOrTablet: false,
    })
  })

  it.each([
    ['garbage', userAgents.garbage],
    ['curl', userAgents.curl],
    ['python-requests', userAgents.pythonRequests],
    ['punctuation only', userAgents.punctuationOnly],
  ] as const)('treats %s as unknown', (_label, userAgent) => {
    const flags = undevice().detect({ userAgent })

    expect(flags).toMatchObject({
      isMobile: false,
      isTablet: false,
      isDesktop: false,
      isUnknown: true,
    })
  })
})
