/*
*	/PageList/cuid
*	function:	POST
*	retrive family pages details from database for user's or family's cuid
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

  const { cuid, page_number } = getQuery(event);
  
  if((cuid as string) == "0"  || cuid == undefined){
      return []
  }

  if(user.role === "admin" && cuid === "") {
    const [count, pagesResult] = await prisma.$transaction([
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
      Pagination: {
        total:  count
      }, 
      data:  pagesResult
    };
  } else if(user.role === "advocate" && cuid === "") {
    const [count, pagesResult] = await prisma.$transaction([
      prisma.page.count({
        where: {
          Family: {
            AdvocateResponsible: {
              id: user.id
            }
          },
        } 
      }),
      prisma.page.findMany({
        skip: page_number as number * 12,
        take: 12,
        where: {
          Family: {
            AdvocateResponsible: {
              id: user.id
            }
          },
        },
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
      Pagination: {
        total:  count
      }, 
      data:  pagesResult
    };
} else if(user.role === "admin" && cuid !=="" || user.role === "advocate" && cuid !== ""  || user.id == cuid ||  user.familyId == cuid) {
    const [count, pagesResult, pagesUnpaginated] = await prisma.$transaction([
      prisma.page.count({ 
        where: {
          OR: [ 
            { userCuid: cuid as string },
            { familyCuid: cuid as string }
          ]
        }
      }),
      prisma.page.findMany({
        where: {
          OR: [
            { userCuid: cuid as string },
            { familyCuid: cuid as string }
          ]
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
      }),
      prisma.page.findMany({
        where: {
          OR: [
            { userCuid: cuid as string },
            { familyCuid: cuid as string }
          ]
        },
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
      Pagination: {
      total: count },
      data:  pagesResult,
      raw_data: pagesUnpaginated
    };
  } else {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }
})
