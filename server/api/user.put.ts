import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default defineEventHandler((event) => {
  // updates the user
  // await prisma.user.update({
    /*data: {
      ...event.context.body,
      UserAccount: {
        connect: {
          cuid: event.context.user_id
        }
      
        }
      }
    });
    const { familyCuid } = getQuery(event);*/
  return 'Hello user'
})
