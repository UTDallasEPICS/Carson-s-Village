/*
*	/FamilyTransactionList
*	function:	GET
*	retrive family all pages donation details from database
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

  const { page_cuid } = getQuery(event);
  
  if((page_cuid as string) == "0" || page_cuid == undefined) {
      return ""
  }

  if(user.role === "admin") {
    const queryRes = prisma.pageDonation.aggregate({
      _max: {
        donationDate: true
      },
      where: {
        pageCuid: page_cuid as string,
      }
    })

    return queryRes;
  } else {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }
})
