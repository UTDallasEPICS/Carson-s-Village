import fs from 'fs'
import type { Role } from './generated/client'
import { PrismaClient } from './generated/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({ adapter })

type RawUser = {
  name: string
  email: string
  role?: Role
}

async function main() {
  console.log('Seeding users...')
  const rawUsers: RawUser[] = JSON.parse(
    fs.readFileSync('prisma/seed/users.json').toString(),
  )
  for (const user of rawUsers) {
    const userResult = await prisma.user.upsert({
      where: {
        email: user.email,
      },
      update: {
        name: user.name,
        role: user.role ?? 'family',
      },
      create: {
        email: user.email,
        name: user.name,
        role: user.role ?? 'family',
      },
    })
    console.log(userResult)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
