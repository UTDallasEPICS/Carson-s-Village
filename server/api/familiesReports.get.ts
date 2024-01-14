import { PrismaClient } from "@prisma/client"
import {loginRedirectUrl} from "./auth0"
import type { User } from "@/types.d.ts"
import type { Family, Page } from "@/types.d.ts"
const prisma = new PrismaClient()

/*
*	/Users
*	function:	GET
*	retrive details of all families from database
*/

export default defineEventHandler(async event => {
  const { page_number } = getQuery(event)

  if(event.context.user.user_role === "advocate"  || event.context.user.user_role === "admin"){
    const [ count, families_raw, paginated_families  ] = await prisma.$transaction([
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
      skip: 12 * (page_number as number),
      take: 12
    }),
  ]);

  return {
   Pagination: {
    total: count
   },
   families_raw,
   paginated_families
  }
  } else {
    return await sendRedirect(event, loginRedirectUrl());
  }
})