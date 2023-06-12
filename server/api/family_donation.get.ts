import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

/*
*	/FamilyTransactionList
*	function:	GET
*	retrive family all pages donation details from database
*/

export default defineEventHandler(async event => {
    const { familyCuid } = await getQuery(event);
    if((familyCuid as string) == "0" || familyCuid == undefined) {
        return []
    }
    const queryRes = await prisma.pageDonation.findMany({
        where: {
            familyCuid : familyCuid as string
        },
        include: {
            Page: true
        }
  });

  return queryRes;
})
