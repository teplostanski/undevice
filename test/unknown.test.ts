import { describe, expect, it } from 'vitest'
import { detectDevice } from '../src/index.js'
import { userAgents } from './fixtures.js'

describe('unknown user agents', () => {
  it.each([
    ['empty object', {}],
    ['whitespace UA', { userAgent: '   ' }],
  ] as const)('treats %s as unknown non-crawler', (_label, input) => {
    const flags = detectDevice(input)

    expect(flags).toMatchObject({
      isMobile: false,
      isTablet: false,
      isDesktop: false,
      isUnknown: true,
      isMobileOrTablet: false,
      isDesktopOrTablet: false,
      isCrawler: false,
    })
  })

  it.each([
    ['garbage', userAgents.garbage],
    ['curl', userAgents.curl],
    ['python-requests', userAgents.pythonRequests],
    ['punctuation only', userAgents.punctuationOnly],
  ] as const)('treats %s as unknown crawler', (_label, userAgent) => {
    const flags = detectDevice({ userAgent })

    expect(flags).toMatchObject({
      isMobile: false,
      isTablet: false,
      isDesktop: false,
      isUnknown: true,
      isCrawler: true,
    })
  })
})
