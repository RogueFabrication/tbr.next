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

let redisInstance: Redis | null = null;

/**
 * Upstash env var compatibility:
 * - Some integrations create UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
 * - Others create UPSTASH_REDIS_KV_REST_API_URL / UPSTASH_REDIS_KV_REST_API_TOKEN
 *
 * We accept either so production doesn't "mysteriously" fail closed.
 */
function readUpstashRestConfig(): { url?: string; token?: string } {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ??
    process.env.UPSTASH_REDIS_KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ??
    process.env.UPSTASH_REDIS_KV_REST_API_TOKEN;
  return { url, token };
}

/**
 * Get Redis client, with defensive handling for missing env vars.
 * In production, throws if env vars are missing (fail closed).
 * In dev, returns null to allow fail-open behavior.
 */
function getRedis(): Redis | null {
  if (redisInstance) return redisInstance;

  const { url, token } = readUpstashRestConfig();

  if (!url || !token) {
    const isProd = process.env.NODE_ENV === "production";
    if (isProd) {
      // In production, fail closed
      const msg =
        "Missing Upstash Redis env vars. Expected either (UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN) or (UPSTASH_REDIS_KV_REST_API_URL, UPSTASH_REDIS_KV_REST_API_TOKEN). Failing closed in production.";
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

// Admin READ rate limiter (GETs). Keep this generous; protects Neon + prevents accidental loops.
let _ratelimitAdminRead: Ratelimit | null = null;
function getRatelimitAdminRead(): Ratelimit {
  if (_ratelimitAdminRead) return _ratelimitAdminRead;
  const redis = getRedis();
  if (!redis) {
    // In dev with missing Redis, create a dummy that always allows (fail open)
    _ratelimitAdminRead = {
      limit: async () => ({
        success: true,
        limit: 300,
        remaining: 299,
        reset: Date.now() + 60000,
      }),
    } as unknown as Ratelimit;
    return _ratelimitAdminRead;
  }
  _ratelimitAdminRead = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(300, "60 s"),
    analytics: true,
  });
  return _ratelimitAdminRead;
}
export const ratelimitAdminRead = new Proxy({} as Ratelimit, {
  get(_target, prop) {
    return getRatelimitAdminRead()[prop as keyof Ratelimit];
  },
});

// Admin WRITE rate limiter (PATCH/POST). Tight enough to stop storms, loose enough for normal editing.
let _ratelimitAdminWrite: Ratelimit | null = null;
function getRatelimitAdminWrite(): Ratelimit {
  if (_ratelimitAdminWrite) return _ratelimitAdminWrite;
  const redis = getRedis();
  if (!redis) {
    _ratelimitAdminWrite = {
      limit: async () => ({
        success: true,
        limit: 120,
        remaining: 119,
        reset: Date.now() + 60000,
      }),
    } as unknown as Ratelimit;
    return _ratelimitAdminWrite;
  }
  _ratelimitAdminWrite = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(120, "60 s"),
    analytics: true,
  });
  return _ratelimitAdminWrite;
}
export const ratelimitAdminWrite = new Proxy({} as Ratelimit, {
  get(_target, prop) {
    return getRatelimitAdminWrite()[prop as keyof Ratelimit];
  },
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

