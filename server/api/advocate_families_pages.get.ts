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

  const { advocate_cuid } = getQuery(event)

  if(session.role === "advocate" || session.role === "admin") {
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
