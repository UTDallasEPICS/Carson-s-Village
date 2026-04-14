import { prisma } from '../server/utils/db';

async function main() {
  const adminuser = await prisma.user.create({
    data: {
      email: 'caleb.beeson@npts.tech',
      user_role: 'admin',
      first_name: 'Caleb',
      last_name: 'Beeson'
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
