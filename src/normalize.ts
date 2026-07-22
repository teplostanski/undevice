import type { DetectDeviceInput, DeviceHeaders } from './types.js'

export type NormalizedInput = Readonly<{
  userAgent: string
  headers: Readonly<Record<string, string>>
}>

const normalizeUserAgent = (userAgent: string | undefined): string =>
  userAgent?.trim() ?? ''

const normalizeHeaders = (headers: DeviceHeaders | undefined): Readonly<Record<string, string>> =>
  Object.fromEntries(
    Object.entries(headers ?? {}).flatMap(([key, value]) => {
      if (value === undefined) {
        return []
      }

      const normalizedValue = value.trim()
      if (normalizedValue.length === 0) {
        return []
      }

      return [[key.toLowerCase(), normalizedValue]] as const
    }),
  )

export const normalizeInput = (input: DetectDeviceInput): NormalizedInput => ({
  userAgent: normalizeUserAgent(input.userAgent),
  headers: normalizeHeaders(input.headers),
})
