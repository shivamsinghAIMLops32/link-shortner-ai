import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'

export async function hashPassword(password: string) {
    return await bcrypt.hash(password, 10)
}

export async function comparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash)
}

export function signToken(payload: any) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET)
    } catch (error) {
        return null
    }
}

export async function getSession() {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) return null

    const payload = verifyToken(token) as any
    if (!payload || !payload.userId) return null

    const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, email: true }
    })

    return user
}
