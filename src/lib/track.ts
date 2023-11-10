import { track } from "@vercel/analytics/react"

export const trackEvent = (action: string, info?: Record<string, any>) => {
  track(action, info);
}