import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

/*
*	/EditPage/cuid
*	function:	PUT
*	submit family page details to database
*/

export default defineEventHandler(async event => {
  const body = await readBody(event)
  delete body.familyCuid;
  
  body.donation_goal = Math.trunc(body.donation_goal * 100);
  body.amount_raised = Math.trunc(body.amount_raised * 100);
  try {
    // updates a pre-existing page
    const queryRes = await prisma.page.update({
      where: {
        cuid: body.cuid
      },
      data: {
        ...body
      }
    });
  } catch (e) {
    console.error(e);
  }
  return true;
});