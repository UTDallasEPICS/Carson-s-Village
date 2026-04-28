/*
*	/Family
*	function:	GET
*	retrive details of all users in the family from database
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

  const family_cuid = getRouterParam(event, 'id')

  if(user.role == "advocate" || user.role == "admin" || user.familyId === family_cuid as string) {
    const queryRes = await prisma.family.findFirst({
      where: {
        id: family_cuid as string
      },
      include: {
        Pages: true,
        FamilyMembers: true,
        AdvocateResponsible: true
      }
    });
    if (!queryRes) {
      return {
        family_name: "",
        advocateCuid: "",
        created_at: "",
        updated_at: "",
        familyCuid: "",
        FamilyDonations: [],
      } as any
    }
    return queryRes;
  } else {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }
})
