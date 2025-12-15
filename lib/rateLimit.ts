// lib/rateLimit.ts
import { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Extract client IP from request headers.
 * Checks x-forwarded-for (first IP), then x-real-ip, else "unknown".
 */
export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    const firstIp = forwarded.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;

  return "unknown";
}

let redisInstance: Redis | null = null;

/**
 * Get Redis client, with defensive handling for missing env vars.
 * In production, throws if env vars are missing (fail closed).
 * In dev, returns null to allow fail-open behavior.
 */
function getRedis(): Redis | null {
  if (redisInstance) return redisInstance;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    const isProd = process.env.NODE_ENV === "production";
    if (isProd) {
      // In production, fail closed
      const msg = "Missing Upstash Redis env vars (UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN). Failing closed in production.";
      console.error(`[rateLimit] ${msg}`);
      throw new Error(msg);
    }
    // In dev, return null to allow fail-open behavior
    console.warn("[rateLimit] Missing Upstash Redis env vars. Rate limiting disabled in dev.");
    return null;
  }

  redisInstance = new Redis({ url, token });
  return redisInstance;
}

// Rate limiter for authentication endpoints (5 requests per 60 seconds)
// Created lazily to handle missing Redis in dev
let _ratelimitAuth: Ratelimit | null = null;
function getRatelimitAuth(): Ratelimit {
  if (_ratelimitAuth) return _ratelimitAuth;
  const redis = getRedis();
  if (!redis) {
    // In dev with missing Redis, create a dummy that always allows (fail open)
    _ratelimitAuth = {
      limit: async () => ({ success: true, limit: 5, remaining: 4, reset: Date.now() + 60000 }),
    } as Ratelimit;
    return _ratelimitAuth;
  }
  _ratelimitAuth = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "60 s"),
    analytics: true,
  });
  return _ratelimitAuth;
}
export const ratelimitAuth = new Proxy({} as Ratelimit, {
  get(_target, prop) {
    return getRatelimitAuth()[prop as keyof Ratelimit];
  },
});

// Rate limiter for admin API endpoints (60 requests per 60 seconds)
// Created lazily to handle missing Redis in dev
let _ratelimitAdmin: Ratelimit | null = null;
function getRatelimitAdmin(): Ratelimit {
  if (_ratelimitAdmin) return _ratelimitAdmin;
  const redis = getRedis();
  if (!redis) {
    // In dev with missing Redis, create a dummy that always allows (fail open)
    _ratelimitAdmin = {
      limit: async () => ({ success: true, limit: 60, remaining: 59, reset: Date.now() + 60000 }),
    } as Ratelimit;
    return _ratelimitAdmin;
  }
  _ratelimitAdmin = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, "60 s"),
    analytics: true,
  });
  return _ratelimitAdmin;
}
export const ratelimitAdmin = new Proxy({} as Ratelimit, {
  get(_target, prop) {
    return getRatelimitAdmin()[prop as keyof Ratelimit];
  },
});

/**
 * Enforce rate limit and return result.
 * @param ratelimit - The Ratelimit instance to use
 * @param keyParts - Array of strings to join with ":" as the identifier
 * @returns { ok: boolean, retryAfter?: number } - ok is false if blocked, retryAfter in seconds if available
 */
export async function enforceRateLimit(
  ratelimit: Ratelimit,
  keyParts: string[],
): Promise<{ ok: boolean; retryAfter?: number }> {
  try {
    const identifier = keyParts.join(":");
    const result = await ratelimit.limit(identifier);

    if (!result.success) {
      return {
        ok: false,
        retryAfter: result.reset ? Math.ceil((result.reset - Date.now()) / 1000) : undefined,
      };
    }

    return { ok: true };
  } catch (err) {
    // If Redis fails, fail closed in production, open in dev
    const isProd = process.env.NODE_ENV === "production";
    console.error("[rateLimit] Redis error:", err);
    if (isProd) {
      // In production, fail closed (block request)
      return { ok: false };
    }
    // In dev, fail open (allow request) but log error
    return { ok: true };
  }
}

/**
 * Check if an IP is locked out due to too many failed auth attempts.
 * Returns lockout duration in seconds if locked, null if not locked.
 */
export async function checkAuthLockout(ip: string): Promise<number | null> {
  try {
    const redis = getRedis();
    if (!redis) return null; // Fail open in dev
    const lockKey = `admin_auth_lock:${ip}`;
    const ttl = await redis.ttl(lockKey);
    if (ttl > 0) {
      return ttl;
    }
    return null;
  } catch (err) {
    console.error("[rateLimit] Failed to check auth lockout:", err);
    // Fail closed in production
    if (process.env.NODE_ENV === "production") {
      return 3600; // Assume locked if Redis fails in production
    }
    return null;
  }
}

/**
 * Increment failed auth attempt counter and apply lockout if threshold reached.
 * @param ip - Client IP address
 * @returns true if lockout was triggered, false otherwise
 */
export async function recordAuthFailure(ip: string): Promise<boolean> {
  try {
    const redis = getRedis();
    if (!redis) return false; // Fail open in dev
    const failKey = `admin_auth_fail:${ip}`;
    const lockKey = `admin_auth_lock:${ip}`;

    // Increment failure count with 10 minute expiry
    const count = await redis.incr(failKey);
    await redis.expire(failKey, 600); // 10 minutes

    // If 10 or more failures, set lockout for 1 hour
    if (count >= 10) {
      await redis.set(lockKey, "1", { ex: 3600 }); // 1 hour lockout
      return true;
    }

    return false;
  } catch (err) {
    console.error("[rateLimit] Failed to record auth failure:", err);
    // Don't block on Redis errors for failure tracking
    return false;
  }
}

/**
 * Clear auth failure counter and lockout (call on successful auth).
 */
export async function clearAuthFailures(ip: string): Promise<void> {
  try {
    const redis = getRedis();
    if (!redis) return; // No-op in dev if Redis missing
    await redis.del(`admin_auth_fail:${ip}`);
    await redis.del(`admin_auth_lock:${ip}`);
  } catch (err) {
    console.error("[rateLimit] Failed to clear auth failures:", err);
    // Non-critical, don't throw
  }
}

