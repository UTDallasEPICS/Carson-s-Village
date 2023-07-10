import { PrismaClient } from "@prisma/client"
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
  
  data.donation_goal = Math.trunc(data.donation_goal * 100);
  data.amount_raised = Math.trunc(data.amount_raised * 100);
  try {
    // updates a pre-existing page
   // if(event.context.user.user_role === "advocate" || event.context.user.cuid === familyCuid ){
    const queryRes = await prisma.page.update({
      where: {
        cuid: data.cuid
      },
      data: {
        ...data
      }
    });
 // }
 // return []
  } catch (e) {
    console.error(e);
  }
  return true;
});