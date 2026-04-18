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
