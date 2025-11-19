import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { invalidateLink, cacheLink } from '@/lib/redis'

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const link = await prisma.link.findUnique({
      where: { id }
    })

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }

    if (link.userId !== session.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.link.delete({
      where: { id }
    })

    await invalidateLink(link.shortCode)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete link error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { url, expiresIn } = await request.json()

    const link = await prisma.link.findUnique({
      where: { id }
    })

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }

    if (link.userId !== session.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    let expiresAt = link.expiresAt
    if (expiresIn !== undefined) {
       expiresAt = expiresIn ? new Date(Date.now() + expiresIn * 60 * 1000) : null
    }

    const updatedLink = await prisma.link.update({
      where: { id },
      data: {
        originalUrl: url || link.originalUrl,
        expiresAt
      }
    })

    // Update cache
    const ttl = updatedLink.expiresAt 
      ? Math.floor((new Date(updatedLink.expiresAt).getTime() - Date.now()) / 1000)
      : 3600
      
    if (ttl > 0) {
        await cacheLink(updatedLink.shortCode, { originalUrl: updatedLink.originalUrl, expiresAt: updatedLink.expiresAt }, ttl)
    } else {
        await invalidateLink(updatedLink.shortCode)
    }

    return NextResponse.json(updatedLink)
  } catch (error) {
    console.error('Update link error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
