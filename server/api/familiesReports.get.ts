import { PrismaClient } from "@prisma/client"
import {loginRedirectUrl} from "./auth0"
import type { User } from "@/types.d.ts"
import type { Family, Page } from "@/types.d.ts"
const prisma = new PrismaClient()

/*
*	/Users
*	function:	GET
*	retrive details of all families from database for the purpose of family reports
*/

export default defineEventHandler(async event => {
  const { page_number, start_date, end_date } = getQuery(event)

  if(event.context.user.user_role === "advocate"  || event.context.user.user_role === "admin"){
    const [ count, all_families, paginated_pages  ] = await prisma.$transaction([
      prisma.page.count(),
      prisma.family.findMany({
        include: {
          Pages: true,
          FamilyMembers: true,
          AdvocateResponsible: true
        }}),
      prisma.page.findMany({
        include: {
          Family: {
            include: {
              AdvocateResponsible: true
            }
          }
        }, 
      
     
    }),
  ]);

  return {
   Pagination: {
    total: count
   },
   all_families,
   paginated_pages
  }
  } else {
    return await sendRedirect(event, loginRedirectUrl());
  }
})