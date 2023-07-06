import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

/*
*	/EditPage/cuid
*	function:	PUT
*	submit family page details to database
*/

export default defineEventHandler(async event => {
  const { Images, ...data } = await readBody(event)
  delete data.familyCuid;
  
  data.donation_goal = Math.trunc(data.donation_goal * 100);
  data.amount_raised = Math.trunc(data.amount_raised * 100);
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
  } catch (e) {
    console.error(e);
  }
  return true;
});