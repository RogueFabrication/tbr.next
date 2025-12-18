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
 * Get Redis client. Rate limiting is a security control; fail loudly if misconfigured.
 */
function getRedis(): Redis {
  if (redisInstance) return redisInstance;

  const { url, token } = readUpstashRestConfig();

  if (!url || !token) {
    // Rate limiting is a security control; fail loudly if misconfigured.
    throw new Error(
      "[rateLimit] Missing Redis env vars. Expected UPSTASH_REDIS_* or project-specific *_REST_API_URL/_REST_API_TOKEN.",
    );
  }

  redisInstance = new Redis({ url, token });
  return redisInstance;
}

// Rate limiter for authentication endpoints (5 requests per 60 seconds)
let _ratelimitAuth: Ratelimit | null = null;
function getRatelimitAuth(): Ratelimit {
  if (_ratelimitAuth) return _ratelimitAuth;
  const redis = getRedis();
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

// Admin READ rate limiter (GETs). Keep this generous; protects Neon + prevents accidental loops.
let _ratelimitAdminRead: Ratelimit | null = null;
function getRatelimitAdminRead(): Ratelimit {
  if (_ratelimitAdminRead) return _ratelimitAdminRead;
  const redis = getRedis();
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
    throw err;
  }
}

/**
 * Increment failed auth attempt counter and apply lockout if threshold reached.
 * @param id - Client identifier (e.g., IP + UA hash)
 * @returns true if lockout was triggered, false otherwise
 */
export async function recordAuthFailure(id: string): Promise<boolean> {
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
}

/**
 * Clear auth failure counter and lockout (call on successful auth).
 */
export async function clearAuthFailures(id: string): Promise<void> {
  const redis = getRedis();
  await redis.del(`admin_auth_fail:${id}`);
  await redis.del(`admin_auth_lock:${id}`);
}

