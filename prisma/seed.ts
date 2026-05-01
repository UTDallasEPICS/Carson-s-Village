import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import { PrismaClient } from "./generated/client"

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaBetterSqlite3({ url: connectionString })

const prisma = new PrismaClient({ adapter })

async function main() {
  const adminuser = await prisma.user.upsert({
    where: {
      email: 'caleb.f.beeson@npts.tech'
    },
    update: {
      role: 'admin',
      name: 'Caleb Beeson'
    },
    create: {
      email: 'caleb.beeson@npts.tech',
      role: 'admin',
      name: 'Caleb Beeson'
    }
  }) 
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
