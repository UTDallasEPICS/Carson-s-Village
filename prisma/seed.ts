import { prisma } from '../server/utils/prisma';

async function main() {
  const adminuser = await prisma.user.create({
    data: {
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
