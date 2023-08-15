import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

/*
*	/FamilyTransactionList
*	function:	GET
*	retrive family all pages donation details from database
*/

export default defineEventHandler(async event => {
    const { family_cuid } = getQuery(event);
    if((family_cuid as string) == "0" || family_cuid == undefined) {
        return []
    }
    const queryRes = await prisma.pageDonation.findMany({
        where: {
        familyCuid: family_cuid as string,
          success:true
        },
        include: {
            Page: true,
            User: true
        }
  });

  return queryRes;
})
