import type { FlagCheck, UndeviceExtensions } from './types.js'

const matchesFlag = (check: FlagCheck, userAgent: string): boolean => {
  if (typeof check === 'function') {
    return check(userAgent)
  }

  return check.some(value => userAgent.includes(value.toLowerCase()))
}

export const createCustomFlags = <T extends UndeviceExtensions>(
  extensions: T,
  userAgent: string,
) => {
  const entries = Object.entries(extensions)

  const flagEntries = entries.map(([flagName, extension]) => {
    if (typeof extension === 'object' && 'exclude' in extension) {
      const isExcluded = matchesFlag(extension.exclude, userAgent)

      if (isExcluded) {
        return [flagName, false]
      }

      return [flagName, matchesFlag(extension.detect, userAgent)]
    }

    if (typeof extension === 'object' && 'detect' in extension) {
      return [flagName, matchesFlag(extension.detect, userAgent)]
    }

    return [flagName, matchesFlag(extension, userAgent)]
  })

  return Object.fromEntries(flagEntries)
}
