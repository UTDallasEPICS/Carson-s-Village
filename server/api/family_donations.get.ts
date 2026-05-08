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

  const family = await prisma.family.findUnique({
    where: {
      id: family_cuid
    }
  })
  if (!family) {
    throw createError({
      statusCode: 404,
      statusMessage: `Family ID ${family_cuid} does not exist`
    })
  }

  if(user.role === "admin" || user.role === "advocate" && family.advocateCuid === user.id || user.familyId === family_cuid) {
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
