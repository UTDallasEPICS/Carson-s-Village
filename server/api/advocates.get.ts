/*
*	/advocates
*	function:	GET
*	retrieve details of all advocates from database
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

  if (user.role === "advocate" || user.role === "admin") {
    const advocates = await prisma.user.findMany({
      where: {
        role: "advocate"
      },
      orderBy: {
        name: "asc"
      }
    })

    return advocates
  } else {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }
})

