import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

/*
*	/Users
*	function:	GET
*	retrive details of all users from database
*/

export default defineEventHandler(async event => {
  console.log(event)
  //console.log(event.context.client.user)
  //if(event.context.user.user_role === "advocate"){
    const queryRes = await prisma.user.findMany({
  });
  return queryRes;
//}
  //return []
})