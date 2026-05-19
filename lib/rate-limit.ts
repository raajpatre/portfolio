/**
 * In-memory rate limiter for server routes.
 * 
 * NOTE: This is an in-memory fallback. It will not work effectively in 
 * serverless edge environments or multi-instance deployments where memory 
 * is not shared. For robust rate limiting in production, use a distributed 
 * store like Upstash Redis.
 */

interface RateLimitData {
  count: number;
  resetAt: number;
}

const rateLimiter = new Map<string, RateLimitData>();

// Configuration: 5 requests per 15 minutes
const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 5;

export function checkRateLimit(ip: string): { success: boolean; limit: number; remaining: number; reset: number } {
  const now = Date.now();
  const record = rateLimiter.get(ip);

  // If no record exists or window expired, create a new one
  if (!record || now > record.resetAt) {
    rateLimiter.set(ip, {
      count: 1,
      resetAt: now + WINDOW_MS,
    });
    return {
      success: true,
      limit: MAX_REQUESTS,
      remaining: MAX_REQUESTS - 1,
      reset: now + WINDOW_MS,
    };
  }

  // Record exists and is within the window
  if (record.count >= MAX_REQUESTS) {
    return {
      success: false,
      limit: MAX_REQUESTS,
      remaining: 0,
      reset: record.resetAt,
    };
  }

  // Increment count
  record.count += 1;
  return {
    success: true,
    limit: MAX_REQUESTS,
    remaining: MAX_REQUESTS - record.count,
    reset: record.resetAt,
  };
}
