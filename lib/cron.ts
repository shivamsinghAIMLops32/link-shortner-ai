import { prisma } from '@/lib/db'

export function startCleanupJob() {
    // Prevent multiple intervals in dev mode hot reload (basic check)
    if ((global as any).cleanupJobStarted) return
    (global as any).cleanupJobStarted = true

    console.log('Starting cleanup job...')

    setInterval(async () => {
        try {
            const now = new Date()
            const result = await prisma.link.deleteMany({
                where: {
                    expiresAt: {
                        lt: now
                    }
                }
            })
            if (result.count > 0) {
                console.log(`[Cron] Cleaned up ${result.count} expired links`)
            }
        } catch (error) {
            console.error('[Cron] Cleanup job error:', error)
        }
    }, 60 * 1000) // Run every minute
}
