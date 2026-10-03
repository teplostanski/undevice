import { describe, expect, it } from 'vitest'
import { undevice } from '../src/index.js'
import { userAgents } from './fixtures.js'

describe('crawler detection', () => {
  it('detects Googlebot as a crawler', () => {
    const flags = undevice({ userAgent: userAgents.googlebot })

    expect(flags.isCrawler).toBe(true)
  })

  it('does not mark regular browsers as crawlers', () => {
    expect(undevice({ userAgent: userAgents.desktopChrome }).isCrawler).toBe(false)
    expect(undevice({ userAgent: userAgents.iphone }).isCrawler).toBe(false)
  })

  it('does not mark an empty user agent as a crawler', () => {
    expect(undevice({}).isCrawler).toBe(false)
  })
})
