import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['error', 'warn'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Raw query helper for "advanced" queries
export async function rawQuery<T>(sql: string): Promise<T[]> {
  return prisma.$queryRawUnsafe<T[]>(sql)
}

// Execute raw command
export async function rawExecute(sql: string): Promise<void> {
  await prisma.$executeRawUnsafe(sql)
}




