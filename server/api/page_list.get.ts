import { PrismaClient } from "@prisma/client"
import {loginRedirectUrl} from "../api/auth0"
const prisma = new PrismaClient()

/*
*	/PageList/cuid
*	function:	POST
*	retrive family pages details from database for user's cuid
*/

export default defineEventHandler(async event => {
    const { cuid, page_number } = getQuery(event);
    console.log(cuid as string)
    
    if((cuid as string) == "0"  || cuid == undefined){
        return []
    }
    if(event.context.user.user_role === "advocate"  || event.context.user?.user_role == "admin" || event.context.user?.cuid === cuid ||  event.context.user?.family_cuid === cuid){
      const [count, pagesResult, pagesUnpaginated] = await prisma.$transaction([
        prisma.page.count({ where: {
          OR: [ { 
            userCuid : cuid as string },
            {
            familyCuid: cuid as string
          } ]
      }}),
         prisma.page.findMany({
            where: {
              OR: [ {
                userCuid : cuid as string,
              }, {
                familyCuid: cuid as string 
              }
              ]
              },
                  skip: page_number as number * 12,
                  take: 12,
                  include: {
                    User: true
                  }
                }),
        prisma.page.findMany({
          where: {
            OR: [ {  
              userCuid : cuid as string },
            {
              familyCuid: cuid as string
            } ]
          }, include: {
            User: true
          }
              })
  ])

  console.log(pagesResult)
    return {
      Pagination: {
      total: count },
      data:  pagesResult,
      raw_data: pagesUnpaginated
    };
  } else {
    return await sendRedirect(event, loginRedirectUrl());
  }
})
