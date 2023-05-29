import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

/*
*	/FamilyTransactionList
*	function:	GET
*	retrive family all pages donation details from database
*/

export default defineEventHandler(async event => {
    const { familyCuid } = await getQuery(event);
    
    const queryRes = await prisma.pageDonation.findMany({
        where: {
            familyCuid : familyCuid as string
        }
  });

  return queryRes;
})
