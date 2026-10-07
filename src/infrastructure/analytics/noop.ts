import type { AnalyticsProvider } from "@/core/ports";

/** ANALYTICS_PROVIDER=noop (MVP default): events are dropped. */
export const noopAnalytics: AnalyticsProvider = { track() {} };
