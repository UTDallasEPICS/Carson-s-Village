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
  const userCuid = data.userCuid
  delete data.userCuid;
  
  if(typeof data.donation_goal == 'string') {
    console.log("test for money parsing issues ", parseInt(data.donation_goal))
    data.donation_goal = Math.trunc(parseInt(data.donation_goal.replace(",","")) * 100);
  }
  if(typeof data.amount_raised == 'string') {
    data.amount_raised = Math.trunc(parseInt(data.amount_raised.replace(",","")) * 100);
  }

  if(event.context.user.user_role === "advocate" || event.context.user?.user_role == "admin" || event.context.user.cuid === userCuid ){
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
      // Initially the images are not linked to a family page, so we add it here 
      // Reason: the cuid for the family page is created in the above in the creation query
      if(JSON.stringify(Images) === '{}') {
        await Promise.all(
        Images.map(async (image: Image) => 
          await prisma.image.update({
            where: {
              cuid: image.cuid
            },
            data:{
              pageCuid: data.cuid
            }
        })))
      }
  } catch (e) {
    console.error(e);
    return false
  }
  return true
} else{
  return await sendRedirect(event, loginRedirectUrl());
}
});