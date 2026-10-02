import { CloudFrontHeader, CloudflareHeader } from './constants.js'
import type { DetectDeviceInput, DeviceHeaders } from './types.js'

export type NormalizedInput = Readonly<{
  userAgent: string
  headers: Readonly<Record<string, string>>
}>

const ReadableHeaders = Object.freeze([
  'user-agent',
  ...Object.values(CloudflareHeader),
  ...Object.values(CloudFrontHeader),
])

const isHeaderReader = (
  headers: DeviceHeaders,
): headers is Readonly<{ get(name: string): string | null }> => typeof headers.get === 'function'

const normalizeHeaders = (headers: DeviceHeaders | undefined): Readonly<Record<string, string>> => {
  const entries =
    headers && isHeaderReader(headers)
      ? ReadableHeaders.map(name => [name, headers.get(name)] as const)
      : Object.entries(headers ?? {})

  return Object.fromEntries(
    entries.flatMap(([key, value]) => {
      const firstValue = typeof value === 'string' ? value : value?.[0]
      const normalizedValue = firstValue?.trim()
      if (!normalizedValue) return []
      return [[key.toLowerCase(), normalizedValue]] as const
    }),
  )
}

export const normalizeInput = (input: DetectDeviceInput): NormalizedInput => {
  const headers = normalizeHeaders(input.headers)
  return {
    userAgent: (input.userAgent ?? headers['user-agent'] ?? '').trim(),
    headers,
  }
}
