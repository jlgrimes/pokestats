import { track } from "@vercel/analytics/react"

export const trackEvent = (action: string, info?: Record<string, any>) => {
  const properties: Record<string, any> = {
    ...info,
    environment: process.env.NEXT_PUBLIC_ENV,
    pathname: window?.location?.pathname
  }

  track(action, properties);
}