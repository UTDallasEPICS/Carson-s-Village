import { PrismaClient } from "@prisma/client"
import {loginRedirectUrl} from "../api/auth0"
const prisma = new PrismaClient()

/*
*	/PageList/cuid
*	function:	POST
*	retrive family pages details from database for a cuid
*/

export default defineEventHandler(async event => {
    const { family_cuid } = await getQuery(event);
    //console.log(event)
    //const cvuser = getCookie(event, 'cvuser')
    //const cvData = JSON.parse(cvuser as string)

    //console.log(cvData.cuid)
    if((family_cuid as string) == "0"  || family_cuid == undefined){
        return []
    }
    if(event.context.user.user_role === "advocate" || event.context.user?.cuid === family_cuid ){
        const queryRes = await prisma.page.findMany({
            where: {
                familyCuid : family_cuid as string
            }
    });
    return queryRes;
  } else {
    return await sendRedirect(event, loginRedirectUrl());
  }
})
