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

  const familyId = getRouterParam(event, 'id')
  const { page_number } = getQuery(event);

  const family = await prisma.family.findUnique({
    where: {
      id: familyId
    }
  })
  if (!family) {
    throw createError({
      statusCode: 400,
      statusMessage: `Family Id ${familyId} could not be found`
    });
  }

  if (user.role === 'admin' || user.role === 'advocate' && user.id === family.advocateCuid || user.familyId === familyId) {
    const [count, results] = await prisma.$transaction([
      prisma.page.count({
        where: {
          familyCuid: familyId
        }
      }),
      prisma.page.findMany({
        where: {
          familyCuid: familyId
        },
        skip: page_number as number * 12,
        take: 12,
        include: {
          User: true,
          Family: {
            include: {
              AdvocateResponsible: true
            }
          }
        }
      })
    ])

    return {
      pageCount: count,
      pages: results
    }
  }
  else {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }
  throw createError({
    statusCode: 500,
    statusMessage: 'Something went wrong'
  })
})
