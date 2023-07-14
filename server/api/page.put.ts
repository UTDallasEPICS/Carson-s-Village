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
  
  data.donation_goal = Math.trunc(parseInt(data.donation_goal.replace(",","")) * 100);
  data.amount_raised = Math.trunc(parseInt(data.amount_raised.replace(",","")) * 100);
  console.log(data.donation_goal)
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