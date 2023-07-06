import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

/*
*	/PageList/cuid
*	function:	POST
*	retrive family pages details from database for a cuid
*/

export default defineEventHandler(async event => {
    const { family_cuid } = await getQuery(event);
    //const cvuser = getCookie(event, 'cvuser')
    //const cvData = JSON.parse(cvuser as string)

    //console.log(cvData.cuid)
    if((family_cuid as string) == "0"  || family_cuid == undefined){ //||  family_cuid !== cvData.cuid || cvData.user_role!="advocate"){
        return []
    }

    const queryRes = await prisma.page.findMany({
        where: {
            familyCuid : family_cuid as string
        }
  });
  return queryRes;
})
