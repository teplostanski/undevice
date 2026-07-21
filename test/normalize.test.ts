import { describe, expect, it } from 'vitest'
import { normalizeInput } from '../src/normalize.js'

describe('normalizeInput', () => {
  it('returns empty values for an empty input', () => {
    expect(normalizeInput({})).toEqual({
      userAgent: '',
      headers: {},
    })
  })

  it('trims the user agent and normalizes header names', () => {
    expect(normalizeInput({
      userAgent: '  iPhone  ',
      headers: {
        'CF-Device-Type': ' Mobile ',
        'X-Empty': '   ',
        'X-Missing': undefined,
      },
    })).toEqual({
      userAgent: 'iPhone',
      headers: {
        'cf-device-type': 'Mobile',
      },
    })
  })
})
