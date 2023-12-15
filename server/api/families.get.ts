import { PrismaClient } from "@prisma/client"
import {loginRedirectUrl} from "./auth0"
const prisma = new PrismaClient()

/*
*	/Users
*	function:	GET
*	retrive details of all users from database
*/

export default defineEventHandler(async event => {

  if(event.context.user.user_role === "advocate"  || event.context.user.user_role === "admin"){
    const queryRes = await prisma.family.findMany({
      include: {
        Pages: true,
        FamilyMembers: true,
        AdvocateResponsible: true
    }
  });
  return queryRes;
  } else {
    return await sendRedirect(event, loginRedirectUrl());
  }
})