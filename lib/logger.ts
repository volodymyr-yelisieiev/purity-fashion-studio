import { isDev } from "@/lib/env";

export const logger = {
  info: (message: string, ...args: unknown[]) => {
    if (isDev) console.info("ℹ️", message, ...args);
  },
  warn: (message: string, ...args: unknown[]) => {
    if (isDev) console.warn("⚠️", message, ...args);
  },
  error: (message: string, ...args: unknown[]) => {
    // Always log errors to console for visibility; in production, integrate Sentry or similar
    console.error("❌", message, ...args);
    // TODO: integrate error tracking (Sentry, Bugsnag) here for production
  },
};
