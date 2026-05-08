/*
*	/Users
*	function:	GET
*	retrive details of all families from database
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

  if(user.role === "admin") {
    const queryRes = await prisma.family.findMany({
      include: {
        Pages: true,
        FamilyMembers: true,
        AdvocateResponsible: true
      }
    });
    return queryRes;
  } 
  else if (user.role === "advocate") {
    const queryRes = await prisma.family.findMany({
      where: {
        advocateCuid: user.id
      },
      include: {
        Pages: true,
        FamilyMembers: true,
        AdvocateResponsible: true
      }
    });
  } else {
    throw createError({
      statusCode: 401, 
      statusMessage: "Unauthorized"
    }) 
  }
})
