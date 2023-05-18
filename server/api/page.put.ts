import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

/*
*	/EditPage/cuid
*	function:	PUT
*	submit family page details to database
*/

export default defineEventHandler(async event => {
  const body = await readBody(event)
  const family_cuid = body.family_cuid
  const cuid = body.cuid;
  delete body.family_cuid;

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
    console.log(e);
  }
  return true;
});