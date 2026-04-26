/*
*	/FamilyTransactionList
*	function:	GET
*	retrive family all pages donation details from database
*/

export default defineEventHandler(async event => {
  const session = await auth.api.getSession({
    headers: event.headers
  })
  if (!session || !session.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }
  const user = session.user

  const { family_cuid } = getQuery(event);
  if((family_cuid as string) == "0" || family_cuid == undefined) {
      return []
  }

  if(user.role === "admin") {
    const queryRes = await prisma.pageDonation.findMany({
      where: {
        familyCuid: family_cuid as string,
      },
      include: {
        Page: true
      }
    });
    return queryRes;
  } else {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }
})
