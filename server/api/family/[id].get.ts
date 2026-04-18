/*
*	/Family
*	function:	GET
*	retrive details of all users in the family from database
*/

export default defineEventHandler(async event => {
  const family_cuid = getRouterParam(event, 'id')
  
  const { user } = await auth.api.getSession({
    headers: event.headers
  })

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }

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
