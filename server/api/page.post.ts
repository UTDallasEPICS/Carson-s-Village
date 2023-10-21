import { PrismaClient } from "@prisma/client"
import { donationFormat } from "@/utils"
import type { Image } from "@/types.d.ts"
import {loginRedirectUrl} from "../api/auth0"
const prisma = new PrismaClient()

/*
*	/EditPage/0
*	function:	POST
*	submit family page details to database
*/

export default defineEventHandler(async event => {
  //extracting family id to connect the page to the authenticated user
  const {Images, ...data} = await readBody(event)
  const familyCuid = data.familyCuid;
  delete data.familyCuid;
  data.donation_goal = Math.trunc(data.donation_goal * 100);
  data.amount_raised = Math.trunc(data.amount_raised * 100);
  if(event.context.user?.user_role === "advocate" || event.context.user?.user_role == 'admin'|| event.context.user.cuid === familyCuid ){
    try{
    // Creates a new entry in the database in the page model to a specfic user
    const queryRes = await prisma.page.create({
      data: {
        ...data,cuid: undefined,
        User: {
          connect: {
            cuid : familyCuid || "0"
          }
        
          }
        }
      });

      // Initially the images are not linked to a family page, so we add it here 
      // Reason: the cuid for the family page is created in the above in the creation query
      await Promise.all(
        Images.map(async (image: Image) => 
          await prisma.image.update({
            where: {
              cuid: image.cuid
            },
            data:{
              pageCuid: queryRes.cuid
            }
          })
        ))
  
      return true
    } catch(e) {
      console.error(e);
      return false
    }
  } else {
    return await sendRedirect(event, loginRedirectUrl());
  }
});


