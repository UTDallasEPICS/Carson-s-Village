/*
*	/Family
*	function:	GET
*	retrive details of all users in the family from database
*/

export default defineEventHandler(async event => {
  const family_cuid = getRouterParam(event, 'id')
  
  const session = await auth.api.getSession({
    headers: event.headers
  })

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }

  if(session.role == "advocate" || session.role == "admin" || session.familyId === family_cuid as string) {
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
        FamilyDonationPayouts: [],
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
