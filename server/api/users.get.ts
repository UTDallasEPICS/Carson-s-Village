import { PrismaClient } from "@prisma/client"
import {loginRedirectUrl} from "../api/auth0"
const prisma = new PrismaClient()

/*
*	/Users
*	function:	GET
*	retrive details of all users from database
*/

export default defineEventHandler(async event => {

  if(event.context.user.user_role === "advocate"){
    const queryRes = await prisma.user.findMany({
  });
  return queryRes;
  } else {
    return await sendRedirect(event, loginRedirectUrl());
  }
})