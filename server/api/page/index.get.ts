/*
*	/EditPage/cuid or /Page/cuid
*	function:	GET
*	retrive family page details from database
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

  const { page_number } = getQuery(event);

  if (user.role === 'admin') {
    const [count, results] = await prisma.$transaction([
      prisma.page.count(),
      prisma.page.findMany({
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
    };
  }
  else if (user.role === 'advocate') {
    const [count, results] = await prisma.$transaction([
      prisma.page.count({
        where: {
          Family: {
            AdvocateResponsible: {
              id: user.id
            }
          }
        }
      }),
      prisma.page.findMany({
        where: {
          Family: {
            AdvocateResponsible: {
              id: user.id
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
    };
  }
  else if (user.role === 'family') {
    const [count, results] = await prisma.$transaction([
      prisma.page.count({
        where: {
          familyCuid: user.familyId
        }
      }),
      prisma.page.findMany({
        where: {
          familyCuid: user.familyId
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
    };
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
  });
})
