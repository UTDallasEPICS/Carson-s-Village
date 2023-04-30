import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default defineEventHandler(async event => {

  const body = await readBody(event)

 // setCookie(event, 'cvuser',(JSON.stringify(body)))
 const queryRes = await prisma.page.update({
  where: {
    cuid: event.context.cuid
  },
  data: {
    ...body
      }
    })


  return queryRes;
});


  /*  const body = await readBody(event)
  setCookie(event, "cv", body.id_token)
  
});*/
