import type { IncomingHttpHeaders } from 'node:http'
import { describe, expect, it } from 'vitest'
import { normalizeInput } from '../src/core/normalize.js'
import type { RequestHeaders } from '../src/index.js'
import { undevice } from '../src/index.js'

describe('normalizeInput', () => {
  it.each([
    ['record', { 'User-Agent': 'iPhone', 'CF-Device-Type': 'tablet' }],
    ['arrays', { 'User-Agent': ['iPhone'], 'CF-Device-Type': ['tablet', 'mobile'] }],
    ['Headers', new Headers({ 'User-Agent': 'iPhone', 'CF-Device-Type': 'tablet' })],
    [
      'reader',
      {
        get(name: string) {
          return (
            new Map([
              ['user-agent', 'iPhone'],
              ['cf-device-type', 'tablet'],
            ]).get(name) ?? null
          )
        },
      },
    ],
  ] as const)('accepts %s and extracts UA with CDN precedence', (_name, headers) => {
    expect(undevice().detect({ headers })).toMatchObject({ isTablet: true, isIos: true })
  })

  it.each([
    ['iPad', 'ipad'],
    ['', ''],
    ['   ', ''],
  ])('uses explicit UA %j over the header', (userAgent, expected) => {
    expect(normalizeInput({ userAgent, headers: { 'User-Agent': 'iPhone' } }).userAgent).toBe(
      expected,
    )
  })

  it('accepts Node.js header types without changing caller data', () => {
    const headers: IncomingHttpHeaders = {
      'user-agent': ' iPhone ',
      'cf-device-type': [' tablet ', 'mobile'],
    }
    const compatible: RequestHeaders = headers
    expect(undevice().detect({ headers: compatible })).toMatchObject({
      isTablet: true,
      isIos: true,
    })
    expect(headers).toEqual({ 'user-agent': ' iPhone ', 'cf-device-type': [' tablet ', 'mobile'] })
  })

  it('preserves the receiver when calling get', () => {
    const headers = new Headers({ 'User-Agent': 'iPhone' })
    expect(undevice().detect({ headers }).isIos).toBe(true)
    expect(headers.get('user-agent')).toBe('iPhone')
  })

  it('uses CloudFront hints when its UA comes from Headers', () => {
    expect(
      undevice().detect({
        headers: new Headers({
          'User-Agent': 'Amazon CloudFront',
          'CloudFront-Is-Mobile-Viewer': 'true',
          'CloudFront-Is-Ios-Viewer': 'true',
        }),
      }),
    ).toMatchObject({ isMobile: true, isIos: true })
  })

  it('ignores empty arrays and does not skip an empty first value', () => {
    expect(
      normalizeInput({ headers: { 'user-agent': ['', 'iPhone'], 'cf-device-type': [] } }),
    ).toEqual({ userAgent: '', headers: {} })
  })

  it('accepts a plain header named get', () => {
    expect(undevice().detect({ headers: { get: 'text', 'user-agent': 'iPhone' } }).isIos).toBe(true)
  })
  it('returns empty values for an empty input', () => {
    expect(normalizeInput({})).toEqual({
      userAgent: '',
      headers: {},
    })
  })

  it('trims and lowercases the user agent and normalizes header names', () => {
    expect(
      normalizeInput({
        userAgent: '  iPhone  ',
        headers: {
          'CF-Device-Type': ' Mobile ',
          'X-Empty': '   ',
          'X-Missing': undefined,
        },
      }),
    ).toEqual({
      userAgent: 'iphone',
      headers: {
        'cf-device-type': 'Mobile',
      },
    })
  })
})
