import { Redis } from "@upstash/redis";

// Initialize Upstash Redis (falls back to local memory if env vars are missing during build)
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "https://mock-redis.upstash.io",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "mock-token",
});

export async function checkRateLimit(identifier: string, limit = 10, windowSeconds = 60): Promise<{ success: boolean; remaining: number }> {
  try {
    if (!process.env.UPSTASH_REDIS_REST_URL) {
      return { success: true, remaining: limit }; // Bypass if not configured yet
    }
    const key = `rate_limit:${identifier}`;
    const requests = await redis.incr(key);
    if (requests === 1) {
      await redis.expire(key, windowSeconds);
    }
    if (requests > limit) {
      return { success: false, remaining: 0 };
    }
    return { success: true, remaining: limit - requests };
  } catch (error) {
    // Fail open during network errors to prevent blocking legitimate logins
    return { success: true, remaining: limit };
  }
}
