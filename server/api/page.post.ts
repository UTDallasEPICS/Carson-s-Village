import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default defineEventHandler(async event => {

  //const body = await readBody(event)
  //console.log(body);
  //setCookie(event, 'cv',(JSON.stringify(event.context.page) ))
  /*await prisma.page.create({
    data: {
      ...event.context.body,
      UserAccount: {
        connect: {
          cuid: event.context.user_id || ""
        }
      
        }
      }
    });*/
  return true;
});


  /*  const body = await readBody(event)
  setCookie(event, "cv", body.id_token)
  
});*/
