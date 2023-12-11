import { PrismaClient } from "@prisma/client"
import {loginRedirectUrl} from "../api/auth0"
const prisma = new PrismaClient()

/*
*	/PageList/cuid
*	function:	POST
*	retrive family pages details from database for a cuid
*/

export default defineEventHandler(async event => {
    const { family_cuid, page_number, excuse } = getQuery(event);
    console.log(page_number as number, "a")
    if((family_cuid as string) == "0"  || family_cuid == undefined){
        return []
    }

    if(event.context.user.user_role === "advocate"  || event.context.user?.user_role == "admin" || event.context.user.familyCuid == family_cuid as string){
      const [count, pagesResult, pagesUnpaginated] = await prisma.$transaction([
        prisma.page.count( { where: {
          familyCuid : family_cuid as string
       }}),
       prisma.page.findMany({
            where: {
                familyCuid : family_cuid as string
            },
            skip: page_number as number * 12,
            take: 12,    
    }), 
    prisma.page.findMany({
      where: {
          familyCuid : family_cuid as string
      },
      skip: page_number as number * 12,
      take: 12,    
})
  ])

    return {
      Pagination: {
      total: count },
      data:  pagesResult,
      raw_data: pagesUnpaginated
    };
  } else {
    if(excuse as boolean == true){
      return []
    }
    return await sendRedirect(event, loginRedirectUrl());
  }
})
