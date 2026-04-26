/*
 * 
 *  Retrieve all pages belonging to a user, admin only
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

  const userId = getRouterParam(event, 'id')
  const { page_number } = getQuery(event);

  const targetUser = await prisma.user.findUnique({
    where: {
      id: userId
    },
    include: { Family: true }
  })
  if (!targetUser) {
    throw createError({
      statusCode: 400,
      statusMessage: `Could not find user ID ${userId}`
    });
  }

  if (user.role === "admin" && targetUser.role === "advocate" || targetUser.role === "admin") {
    const [count, results] = await prisma.$transaction([
      prisma.page.count({
        where: {
          Family: {
            AdvocateResponsible: {
              id: userId
            }
          }
        }
      }),
      prisma.page.findMany({
        where: {
          Family: {
            AdvocateResponsible: {
              id: userId
            }
          }
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
  else if (user.role === "admin" && targetUser.role === "family") {
    const [count, results] = await prisma.$transaction([
      prisma.page.count({
        where: {
          familyCuid: targetUser.familyId
        }
      }),
      prisma.page.findMany({
        where: {
          familyCuid: targetUser.familyId
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
  else if (user.role === "advocate" && targetUser.role === "family" && targetUser.Family.advocateCuid === user.id) {
    const [count, results] = await prisma.$transaction([
      prisma.page.count({
        where: {
          familyCuid: targetUser.familyId
        }
      }),
      prisma.page.findMany({
        where: {
          familyCuid: targetUser.familyId
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
  else if (user.role === "family" && targetUser.id === user.id) {
    const [count, results] = await prisma.$transaction([
      prisma.page.count({
        where: {
          familyCuid: targetUser.familyId
        }
      }),
      prisma.page.findMany({
        where: {
          familyCuid: targetUser.familyId
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
