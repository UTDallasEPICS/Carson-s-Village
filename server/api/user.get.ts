import { PrismaClient } from "@prisma/client"
import {loginRedirectUrl} from "../api/auth0"
const prisma = new PrismaClient()

/*
*	/EditUser/cuid
*	function:	GET
*	retrive authenticated user details from database
*/

export default defineEventHandler(async event => {
  // check if role == advocate?
  const { cuid } = getQuery(event);
  if( (cuid as string) == "0" || cuid == undefined){
    return []
  }
  //const role = event.context.user.Clients.find(o => o.clientCuid == clientCuid)
  // retrieves a single user
  if(event.context.user.user_role === "advocate" ){
    const queryRes = await prisma.user.findFirst({
      where: {cuid: (cuid as string) }
    });
    return queryRes;
  } else {
    console.log("unauthorized")
    return await sendRedirect(event, loginRedirectUrl());
  }
})
