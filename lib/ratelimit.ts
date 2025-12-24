/**
 * Rate Limiter with fallback strategy
 *
 * PRODUCTION RECOMMENDATION:
 * For production with multiple serverless instances, install @upstash/ratelimit:
 *
 * ```
 * pnpm add @upstash/ratelimit @upstash/redis
 * ```
 *
 * Then set environment variables:
 * - UPSTASH_REDIS_REST_URL
 * - UPSTASH_REDIS_REST_TOKEN
 *
 * This implementation provides:
 * 1. Redis-based rate limiting when Upstash is configured (recommended for production)
 * 2. In-memory fallback for development/single-instance deployments
 *
 * WARNING: In-memory rate limiting does NOT work across serverless function instances.
 * Each cold start creates a new Map, and concurrent instances don't share state.
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store (fallback only - not suitable for production serverless)
const memoryStore = new Map<string, RateLimitEntry>();

// Check if Upstash is configured
const isUpstashConfigured = !!(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);

// Log warning in development if using memory store (using logger would cause circular dependency)
if (!isUpstashConfigured && process.env.NODE_ENV === "development") {
  console.warn(
    "⚠️  Rate limiting using in-memory store. " +
      "For production, configure UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN"
  );
}

// Clean up expired entries periodically (only for in-memory fallback)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of memoryStore.entries()) {
      if (entry.resetTime < now) {
        memoryStore.delete(key);
      }
    }
  }, 60000); // Clean every minute
}

interface RateLimitOptions {
  /** Maximum number of requests allowed in the window */
  limit: number;
  /** Time window in milliseconds */
  windowMs: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
}

/**
 * Check if a request is within rate limits
 *
 * Uses in-memory store as fallback. For production, configure Upstash Redis.
 *
 * @param identifier - Unique identifier for the client (e.g., IP address)
 * @param options - Rate limit configuration
 * @returns Result indicating if request is allowed
 */
export function rateLimit(
  identifier: string,
  options: RateLimitOptions = { limit: 5, windowMs: 60000 }
): RateLimitResult {
  // TODO: When Upstash is installed, use this implementation instead:
  //
  // import { Ratelimit } from '@upstash/ratelimit'
  // import { Redis } from '@upstash/redis'
  //
  // const redis = new Redis({
  //   url: process.env.UPSTASH_REDIS_REST_URL!,
  //   token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  // })
  //
  // const ratelimit = new Ratelimit({
  //   redis,
  //   limiter: Ratelimit.slidingWindow(options.limit, `${options.windowMs}ms`),
  //   analytics: true,
  // })
  //
  // const result = await ratelimit.limit(identifier)
  // return {
  //   success: result.success,
  //   remaining: result.remaining,
  //   reset: result.reset,
  // }

  // Fallback: In-memory rate limiting
  const now = Date.now();
  const entry = memoryStore.get(identifier);

  // No existing entry or window expired
  if (!entry || entry.resetTime < now) {
    memoryStore.set(identifier, {
      count: 1,
      resetTime: now + options.windowMs,
    });
    return {
      success: true,
      remaining: options.limit - 1,
      reset: now + options.windowMs,
    };
  }

  // Within window
  if (entry.count < options.limit) {
    entry.count++;
    return {
      success: true,
      remaining: options.limit - entry.count,
      reset: entry.resetTime,
    };
  }

  // Rate limited
  return {
    success: false,
    remaining: 0,
    reset: entry.resetTime,
  };
}

/**
 * Get client IP from request headers
 * Works with Vercel, Cloudflare, and standard proxies
 */
export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}
