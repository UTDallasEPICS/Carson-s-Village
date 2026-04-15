/*
*	/EditUser/cuid
*	function:	GET
*	retrive authenticated user details from database
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
  const { cuid } = getQuery(event);
  if( (cuid as string) == "0" || cuid == undefined){
    return []
  }

  // retrieves a single user
  if(session.role === "advocate" || session.role === "admin") {
    const queryRes = await prisma.user.findFirst({
      where: {
        id: (cuid as string)
      },
      include: {
        AdvocateFamily: true
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
