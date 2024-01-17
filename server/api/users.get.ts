import { PrismaClient } from "@prisma/client"
import {loginRedirectUrl} from "../api/auth0"
const prisma = new PrismaClient()

/*
*	/Users
*	function:	GET
*	retrive details of all users from database
*/

export default defineEventHandler(async event => {
  const { page_number } = getQuery(event);

  if(event.context.user.user_role === "advocate" || event.context.user.user_role === "admin"){
  // Pagination via taking the absolute table page number with 12 records per page
    const [ count, userData ] = await prisma.$transaction([
      prisma.user.count(),
      prisma.user.findMany({
      skip: page_number as number * 12,
      take: 12,
      include: {
        Pages: true,
        Family: true
    }
  })
  ]);
  return {
    Pagination: {
      total: count
    }, 
    userData
  }
  } else {
    return await sendRedirect(event, loginRedirectUrl());
  }
})