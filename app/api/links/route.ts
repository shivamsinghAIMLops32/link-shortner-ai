import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { cacheLink } from '@/lib/redis'
import { rateLimit } from '@/lib/ratelimit'
import { z } from 'zod'

const createLinkSchema = z.object({
  url: z.string().url({ message: "Invalid URL" }),
  customAlias: z.string().min(3).max(20).regex(/^[a-zA-Z0-9-_]+$/, "Alias must be alphanumeric").optional().or(z.literal('')),
  expiresIn: z.number().min(1).optional().nullable()
})

function generateShortCode(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate Limiting: 10 links per minute per user
    const { success } = await rateLimit(`create_link:${session.id}`, 10, 60)
    if (!success) {
      return NextResponse.json({ error: 'Rate limit exceeded. Please try again later.' }, { status: 429 })
    }

    const body = await request.json()
    const validation = createLinkSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
    }

    const { url, customAlias, expiresIn } = validation.data

    let shortCode = customAlias || generateShortCode()

    // Check for collision if custom alias
    if (customAlias) {
      const existing = await prisma.link.findFirst({
        where: { 
          OR: [
            { shortCode: customAlias },
            { customAlias: customAlias }
          ]
        }
      })
      if (existing) {
        return NextResponse.json({ error: 'Alias already taken' }, { status: 409 })
      }
    } else {
      // Ensure generated code is unique (simple retry logic)
      let isUnique = false
      while (!isUnique) {
        const existing = await prisma.link.findUnique({ where: { shortCode } })
        if (!existing) isUnique = true
        else shortCode = generateShortCode()
      }
    }

    let expiresAt = null
    if (expiresIn) {
      expiresAt = new Date(Date.now() + expiresIn * 60 * 1000)
    }

    const link = await prisma.link.create({
      data: {
        originalUrl: url,
        shortCode,
        customAlias: customAlias || null,
        userId: session.id,
        expiresAt
      }
    })

    // Cache in Redis
    const ttl = expiresIn ? expiresIn * 60 : 3600
    await cacheLink(shortCode, { originalUrl: url, expiresAt }, ttl)

    return NextResponse.json(link)
  } catch (error) {
    console.error('Create link error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const links = await prisma.link.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(links)
  } catch (error) {
    console.error('Get links error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
