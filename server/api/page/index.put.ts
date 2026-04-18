import type { Image } from "@/types.d.ts"

/*
*	/EditPage/cuid
*	function:	PUT
*	submit family page details to database
*/

export default defineEventHandler(async event => {
  const { user } = await auth.api.getSession({
    headers: event.headers
  })

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }
  const { Images, Reply, PageDonations, userCuid, familyCuid, Family, ...data } = await readBody(event)
  //const userCuid = data.userCuid
  //delete data.userCuid;
  
  if(user.role === "advocate" || user.role == "admin" || user.id == userCuid || user.familyId == familyCuid ) {
    delete data.Family // Not sure why this is needed to fix an error
    try {
      // Removes comma parses the whole decimal number and converts it to cents to be stored in DB
      if(typeof data.donation_goal == 'string') {
        data.donation_goal = Math.trunc(parseFloat(data.donation_goal.replace(",","")) * 100);
      }
      if(typeof data.amount_raised == 'string') {
        data.amount_raised = Math.trunc(parseFloat(data.amount_raised.replace(",","")) * 100);
        console.log("amount raised after removing formating ", data.amount_raised)
      }
      // updates a pre-existing page
      const queryRes = await prisma.page.update({
        where: {
          id: data.cuid
        },
        data: {
          ...data
        }
      });
    } catch (e) {
      console.error(e);
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to update page ${data.cuid}`
      });
    }
  } else {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      });
  }
});
