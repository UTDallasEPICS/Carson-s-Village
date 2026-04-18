/*
*	/PageList/cuid
*	function:	POST
*	retrive family pages details from database for a family's cuid
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

  const { family_cuid, page_number} = getQuery(event);
  if((family_cuid as string) == "0"  || family_cuid == undefined){
      return []
  }

  if(user.role === "advocate"  || user.role == "admin" || user.familyId == family_cuid as string) {
    const [count, pagesResult, pagesUnpaginated] = await prisma.$transaction([
      prisma.page.count({ 
        where: {
          familyCuid : family_cuid as string
        }
      }),
      prisma.page.findMany({
        where: {
          familyCuid : family_cuid as string
        },
        skip: page_number as number * 12,
        take: 12,    
        include: {
          User: true,
          Family: {
            include: {
              AdvocateResponsible: {
                select: {
                  first_name: true,
                  last_name: true
                }
              }
            }
          }
        }
      }), 
      prisma.page.findMany({
        where: {
          familyCuid : family_cuid as string
        },
        include: {
          User: true,
          Family: {
            include: {
              AdvocateResponsible: {
                select: {
                  first_name: true,
                  last_name: true
                }
              }
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
