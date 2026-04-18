/*
*	/EditUser/cuid
*	function:	GET
*	retrive authenticated user details from database
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
  const { cuid } = getQuery(event);
  if( (cuid as string) == "0" || cuid == undefined){
    return []
  }

  // retrieves a single user
  if(user.role === "advocate" || user.role === "admin") {
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
