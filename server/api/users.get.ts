import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

/*
*	/Users
*	function:	GET
*	retrive details of all users from database
*/

export default defineEventHandler(async event => {
    const queryRes = await prisma.user.findMany({
  });
  return queryRes;
})
