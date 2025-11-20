import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCachedLink, cacheLink } from '@/lib/redis'

export async function GET(request: Request, { params }: { params: Promise<{ shortCode: string }> }) {
    const { shortCode } = await params // Next.js 15 requires awaiting params

    try {
        // 1. Check Redis
        const cached = await getCachedLink(shortCode)

        if (cached) {
            if (cached.expiresAt && new Date(cached.expiresAt) < new Date()) {
                return NextResponse.json({ error: 'Link expired' }, { status: 410 })
            }

            // Async update clicks (fire and forget-ish)
            prisma.link.update({
                where: { shortCode },
                data: { clicks: { increment: 1 } }
            }).catch(err => console.error('Failed to update clicks', err))

            return NextResponse.redirect(cached.originalUrl)
        }

        // 2. Check DB
        const link = await prisma.link.findUnique({
            where: { shortCode }
        })

        if (!link) {
            return NextResponse.json({ error: 'Link not found' }, { status: 404 })
        }

        if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
            return NextResponse.json({ error: 'Link expired' }, { status: 410 })
        }

        // 3. Cache and Redirect
        const ttl = link.expiresAt
            ? Math.floor((new Date(link.expiresAt).getTime() - Date.now()) / 1000)
            : 3600

        if (ttl > 0) {
            await cacheLink(shortCode, { originalUrl: link.originalUrl, expiresAt: link.expiresAt }, ttl)
        }

        // Update clicks
        await prisma.link.update({
            where: { id: link.id },
            data: { clicks: { increment: 1 } }
        })

        return NextResponse.redirect(link.originalUrl)

    } catch (error) {
        console.error('Redirect error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
