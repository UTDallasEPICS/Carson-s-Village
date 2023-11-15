import { PrismaClient } from "@prisma/client"
import {loginRedirectUrl} from "../api/auth0"
const prisma = new PrismaClient()

/*
*	/PageList/cuid
*	function:	POST
*	retrive family pages details from database for a cuid
*/

export default defineEventHandler(async event => {
    const { user_cuid } = await getQuery(event);
    if((user_cuid as string) == "0"  || user_cuid == undefined){
        return []
    }
    if(event.context.user.user_role === "advocate"  || event.context.user?.user_role == "admin" || event.context.user?.cuid === user_cuid ){
        const queryRes = await prisma.page.findMany({
            where: {
                userCuid : user_cuid as string
            }
    });
    return queryRes;
  } else {
    return await sendRedirect(event, loginRedirectUrl());
  }
})
