import { PrismaClient } from "@prisma/client"
import {loginRedirectUrl} from "../api/auth0"
const prisma = new PrismaClient()

/*
*	/PageList/cuid
*	function:	POST
*	retrive family pages details from database for a cuid
*/

export default defineEventHandler(async event => {
    const { family_cuid, excuse } = getQuery(event);
    if((family_cuid as string) == "0"  || family_cuid == undefined){
        return []
    }

    if(event.context.user.user_role === "advocate"  || event.context.user?.user_role == "admin" || event.context.user.familyCuid == family_cuid as string){
        const queryRes = await prisma.page.findMany({
            where: {
                familiesCuid : family_cuid as string
            }
    });
    return queryRes;
  } else {
    if(excuse as boolean == true){
      return []
    }
    return await sendRedirect(event, loginRedirectUrl());
  }
})
