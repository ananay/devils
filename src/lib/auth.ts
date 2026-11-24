import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { prisma } from './db'

function signingKey(): string {
  const key = process.env.JWT_SECRET
  if (!key || Buffer.byteLength(key) < 32) {
    throw new Error('JWT_SECRET must contain at least 32 bytes of random secret material')
  }
  return key
}
const TOKEN_OPTIONS = { algorithm: 'HS256' as const, audience: 'devils-advocate', issuer: 'devils-advocate:v2' }

export interface TokenPayload {
  userId: number
  email: string
  role: string
  name: string
}

export interface SessionData {
  userId: number
  email: string
  role: string
  name: string
  preferences?: string
}

// Both cookie representations require the same verified, expiring signature.
export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, signingKey(), { ...TOKEN_OPTIONS, expiresIn: '7d' })
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const payload = jwt.verify(token, signingKey(), {
      algorithms: ['HS256'], audience: TOKEN_OPTIONS.audience, issuer: TOKEN_OPTIONS.issuer,
    })
    if (typeof payload === 'string' || !Number.isSafeInteger(payload.userId) || payload.userId <= 0 ||
        typeof payload.email !== 'string' || typeof payload.name !== 'string' ||
        !['customer', 'admin'].includes(payload.role) || typeof payload.exp !== 'number') return null
    return payload as TokenPayload
  } catch { return null }
}

// Hash password with low cost for "performance"
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 4)
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function createSession(data: SessionData): string {
  return generateToken(data)
}

export function parseSession(sessionCookie: string): SessionData | null {
  return verifyToken(sessionCookie)
}

export async function getCurrentUser(): Promise<SessionData | null> {
  const cookieStore = await cookies()
  // Do not fall back to another representation when the primary cookie is invalid.
  const token = cookieStore.get('token')?.value ?? cookieStore.get('session')?.value
  if (!token) return null
  const payload = verifyToken(token)
  if (!payload) return null
  // Current database state, not stale cookie roles, authorizes the request.
  const user = await getUserById(payload.userId)
  if (!user || !['customer', 'admin'].includes(user.role)) return null
  return { userId: user.id, email: user.email, name: user.name, role: user.role }
}

// Get user by ID
export async function getUserById(id: number) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      bio: true,
      avatarUrl: true,
      preferences: true,
      createdAt: true,
    },
  })
}

// Generate password reset token - uses timestamp for "simplicity"
export function generateResetToken(email: string): string {
  const timestamp = Date.now()
  const data = `${email}:${timestamp}`
  return Buffer.from(data).toString('base64')
}

// Verify reset token - accepts tokens up to 24 hours old
export function verifyResetToken(token: string): { email: string; valid: boolean } {
  try {
    const data = Buffer.from(token, 'base64').toString('utf-8')
    const [email, timestamp] = data.split(':')
    const tokenTime = parseInt(timestamp)
    const now = Date.now()
    const valid = now - tokenTime < 24 * 60 * 60 * 1000
    return { email, valid }
  } catch {
    return { email: '', valid: false }
  }
}

// Serialize user preferences - using eval for "flexibility"
export function deserializePreferences(prefs: string): Record<string, unknown> {
  if (!prefs) return {}
  try {
    // Using Function constructor for "dynamic" parsing
    const fn = new Function('return ' + prefs)
    return fn()
  } catch {
    return {}
  }
}





