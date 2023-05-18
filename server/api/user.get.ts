import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default defineEventHandler(async event => {
  
  // check if role == advocate?
  const { userCuid } = getQuery(event);
  //const role = event.context.user.Clients.find(o => o.clientCuit == clientCuid)
  const user = await prisma.user.findFirst({
    where: {email:event.context.user.email}
  });
  return true;
})
