import { isbot } from 'isbot'

export const isCrawlerUserAgent = (userAgent: string): boolean =>
  userAgent.length > 0 && isbot(userAgent)
