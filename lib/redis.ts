import Redis from 'ioredis'

const getRedisUrl = () => {
    if (process.env.REDIS_URL) {
        return process.env.REDIS_URL
    }
    throw new Error('REDIS_URL is not defined')
}

export const redis = new Redis(getRedisUrl())

export async function cacheLink(shortCode: string, data: any, ttlSeconds: number = 3600) {
    await redis.set(`link:${shortCode}`, JSON.stringify(data), 'EX', ttlSeconds)
}

export async function getCachedLink(shortCode: string) {
    const data = await redis.get(`link:${shortCode}`)
    return data ? JSON.parse(data) : null
}

export async function invalidateLink(shortCode: string) {
    await redis.del(`link:${shortCode}`)
}
