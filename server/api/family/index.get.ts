/*
*	/Users
*	function:	GET
*	retrive details of all families from database
*/

export default defineEventHandler(async event => {
  const session = await auth.api.getSession({
    headers: event.headers
  })

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }

  if(session.role === "advocate" || session.role === "admin") {
    const queryRes = await prisma.family.findMany({
      include: {
        Pages: true,
        FamilyMembers: true,
        AdvocateResponsible: true
      }
    });
    return queryRes;
  } else {
    throw createError({
      statusCode: 401, 
      statusMessage: "Unauthorized"
    }) 
  }
})
