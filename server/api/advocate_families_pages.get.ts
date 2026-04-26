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

  const { advocate_cuid } = getQuery(event)

  if(user.role === "advocate" || user.role === "admin") {
    const result = await prisma.family.findMany({
      where: { 
          advocateCuid: advocate_cuid as string
      },
      include: {
        Pages: true
      } 
    })
    return result
  } else {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }
})
