import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import {loginRedirectUrl} from "../api/auth0"

/*
*	/FamilyTransactionList
*	function:	GET
*	retrive family all pages donation details from database
*/

export default defineEventHandler(async event => {
    const { page_cuid } = getQuery(event);
    
    if((page_cuid as string) == "0" || page_cuid == undefined) {
        return ""
    }
    console.log(page_cuid)
    if(event.context.user?.user_role === "admin") {
      const queryRes = prisma.pageDonation.aggregate({
          _max: {
              donationDate: true
          },
          where: {
            pageCuid: page_cuid as string,
            success: true
          }
      })

    return queryRes;
    } else {
      return await sendRedirect(event, loginRedirectUrl());
    }
})