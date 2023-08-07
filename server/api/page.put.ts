import { PrismaClient } from "@prisma/client"
import {loginRedirectUrl} from "../api/auth0"
import type { Image } from "@/types.d.ts"
const prisma = new PrismaClient()

/*
*	/EditPage/cuid
*	function:	PUT
*	submit family page details to database
*/

export default defineEventHandler(async event => {
  const { Images, ...data } = await readBody(event)
  const familyCuid = data.familyCuid
  delete data.familyCuid;
  
  data.donation_goal = Math.trunc(parseInt(data.donation_goal.replace(",","")) * 100);
  data.amount_raised = Math.trunc(parseInt(data.amount_raised.replace(",","")) * 100);
  if(event.context.user.user_role === "advocate" || event.context.user.cuid === familyCuid ){
  try {
    // updates a pre-existing page
   
    const queryRes = await prisma.page.update({
      where: {
        cuid: data.cuid
      },
      data: {
        ...data
      }
    });
    //if(Images.length != 0){
      await Promise.all(
      Images.map(async (image: Image) => {
        await prisma.image.update({
          where: {
            cuid: image.cuid
          },
          data:{
            pageCuid: data.pageCuid
          }
        })
      }))
    
 // return []
  } catch (e) {
    console.error(e);
    return false
  }
  return true
} else{
  console.log("unauthorized")
  return await sendRedirect(event, loginRedirectUrl());
}
});