import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

/*
*	/EditUser/cuid
*	function:	GET
*	retrive authenticated user details from database
*/

export default defineEventHandler(async event => {
  // check if role == advocate?
  const { cuid } = getQuery(event);

  //const role = event.context.user.Clients.find(o => o.clientCuid == clientCuid)
  // retrieves a single user
  const queryRes = await prisma.user.findFirst({
    where: {cuid: (cuid as string) }
  });
  return queryRes;
})
