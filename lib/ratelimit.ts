import { redis } from './redis'

export async function rateLimit(identifier: string, limit: number = 10, windowSeconds: number = 60) {
  const key = `ratelimit:${identifier}`
  
  const current = await redis.incr(key)
  
  if (current === 1) {
    await redis.expire(key, windowSeconds)
  }
  
  return {
    success: current <= limit,
    limit,
    remaining: Math.max(0, limit - current),
    reset: await redis.ttl(key)
  }
}
