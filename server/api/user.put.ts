import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default defineEventHandler((event) => {
  // updates the user
  const body = readBody(event);
  setCookie(event,'cvuser',(JSON.stringify(body)))
    /*const queryRes = await prisma.user.update({
    data: {
      ...body,
      User: {
        connect: {
          cuid: event.context.cuid 
        }
      
        }
      }
    });*/
   // const { familyCuid } = getQuery(event);
  return 'Hello user'
})
