// lib/rateLimit.ts
import { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export function getClientIp(request: NextRequest): string {
  // Vercel sets x-forwarded-for. Take the first IP in the list.
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return request.ip ?? "0.0.0.0";
}

/**
 * Small stable hash for scoping rate limits per client device without new deps.
 * (Not cryptographic; just reduces collisions vs raw UA strings.)
 */
function hashString(input: string): string {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) + hash) ^ input.charCodeAt(i); // djb2 xor variant
  }
  // Convert to unsigned 32-bit and hex
  return (hash >>> 0).toString(16);
}

/**
 * Client identifier for auth throttling: IP + hashed user-agent.
 * Prevents one person on a shared NAT/static IP from locking out everyone.
 */
export function getClientId(request: NextRequest): string {
  const ip = getClientIp(request);
  const ua = request.headers.get("user-agent") ?? "unknown";
  return `${ip}:${hashString(ua)}`;
}

let _redis: Redis | null = null;

function getRedis(): Redis {
  if (_redis) return _redis;

  /**
   * Upstash env var names vary depending on how you provisioned it:
   * - Direct Upstash docs / manual: UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
   * - Vercel Upstash integration: UPSTASH_REDIS_KV_REST_API_URL / UPSTASH_REDIS_KV_REST_API_TOKEN
   *   (and sometimes a read-only token too)
   */
  const restUrl =
    process.env.UPSTASH_REDIS_REST_URL?.trim() ||
    process.env.UPSTASH_REDIS_KV_REST_API_URL?.trim() ||
    "";

  const restToken =
    process.env.UPSTASH_REDIS_REST_TOKEN?.trim() ||
    process.env.UPSTASH_REDIS_KV_REST_API_TOKEN?.trim() ||
    // If only a read-only token exists, allow it to initialize (reads still help some uses),
    // but note: rate limiting requires writes, so this should be last-resort.
    process.env.UPSTASH_REDIS_KV_REST_API_READ_ONLY_TOKEN?.trim() ||
    "";

  if (!restUrl || !restToken) {
    throw new Error([
      "Missing Upstash REST env vars for rate limiting.",
      "Set one of the following pairs:",
      "- UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN (manual Upstash)",
      "- UPSTASH_REDIS_KV_REST_API_URL + UPSTASH_REDIS_KV_REST_API_TOKEN (Vercel integration)",
    ].join(" "));
  }

  _redis = new Redis({
    url: restUrl,
    token: restToken,
  });
  return _redis;
}

// Rate limiter for authentication endpoints (5 requests per 60 seconds)
// Created lazily to handle missing Redis in dev
let _ratelimitAuth: Ratelimit | null = null;
function getRatelimitAuth(): Ratelimit {
  if (_ratelimitAuth) return _ratelimitAuth;
  try {
    const redis = getRedis();
    _ratelimitAuth = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "60 s"),
      analytics: true,
    });
    return _ratelimitAuth;
  } catch {
    // In dev with missing Redis, create a dummy that always allows (fail open)
    _ratelimitAuth = {
      limit: async () => ({ success: true, limit: 5, remaining: 4, reset: Date.now() + 60000 }),
    } as unknown as Ratelimit;
    return _ratelimitAuth;
  }
}
export const ratelimitAuth = new Proxy({} as Ratelimit, {
  get(_target, prop) {
    return getRatelimitAuth()[prop as keyof Ratelimit];
  },
});

export const ratelimitAdmin = new Ratelimit({
  redis: getRedis(),
  limiter: Ratelimit.slidingWindow(60, "60 s"),
  analytics: true,
  prefix: "tbr:ratelimit:admin",
});

export async function enforceRateLimit(
  limiter: Ratelimit,
  keyParts: (string | number)[],
) {
  const key = keyParts.map(String).join(":");
  const result = await limiter.limit(key);

  return {
    ok: result.success,
    retryAfter: result.reset
      ? Math.max(1, Math.ceil((result.reset - Date.now()) / 1000))
      : 60,
    remaining: result.remaining,
    reset: result.reset,
  };
}

/**
 * Check if a client identifier is locked out due to too many failed auth attempts.
 * Returns lockout duration in seconds if locked, null if not locked.
 */
export async function checkAuthLockout(id: string): Promise<number | null> {
  try {
    const redis = getRedis();
    const lockKey = `admin_auth_lock:${id}`;
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
 * @param id - Client identifier (e.g., IP + UA hash)
 * @returns true if lockout was triggered, false otherwise
 */
export async function recordAuthFailure(id: string): Promise<boolean> {
  try {
    const redis = getRedis();
    const failKey = `admin_auth_fail:${id}`;
    const lockKey = `admin_auth_lock:${id}`;

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
export async function clearAuthFailures(id: string): Promise<void> {
  try {
    const redis = getRedis();
    await redis.del(`admin_auth_fail:${id}`);
    await redis.del(`admin_auth_lock:${id}`);
  } catch (err) {
    console.error("[rateLimit] Failed to clear auth failures:", err);
    // Non-critical, don't throw
  }
}

