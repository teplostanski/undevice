import { describe, expect, it } from 'vitest'
import { detectDevice } from '../src/index.js'
import { userAgents } from './fixtures.js'

describe('crawler detection', () => {
  it('detects Googlebot as a crawler', () => {
    const flags = detectDevice({ userAgent: userAgents.googlebot })

    expect(flags.isCrawler).toBe(true)
  })

  it('does not mark regular browsers as crawlers', () => {
    expect(detectDevice({ userAgent: userAgents.desktopChrome }).isCrawler).toBe(false)
    expect(detectDevice({ userAgent: userAgents.iphone }).isCrawler).toBe(false)
  })

  it('does not mark an empty user agent as a crawler', () => {
    expect(detectDevice({}).isCrawler).toBe(false)
  })
})
