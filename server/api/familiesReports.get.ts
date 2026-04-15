import type { User, Family, Page } from "@/types.d.ts"

/*
*	/Users
*	function:	GET
*	retrive details of all families from database for the purpose of family reports
*/

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

  const { page_number, dimensions, start_date, end_date, date_field  } = getQuery(event)
  const start_date_date = start_date as Date
  const end_date_date = end_date as Date

  if(session.role === "advocate"  || session.role === "admin") {
    const [ count, count_date_ranged, all_families, paginated_pages, date_ranged_pages ] = await prisma.$transaction([
      prisma.page.count(),
      prisma.page.count({ 
        where: {
          [date_field as string]: {
            gte: new Date(start_date as string),
            lte: new Date(end_date as string)
          } 
        }
      }),
      prisma.family.findMany({
        include: {
          Pages: true,
          FamilyMembers: true,
          AdvocateResponsible: true
        }
      }),
      prisma.page.findMany({
        include: {
          Family: {
            include: {
              AdvocateResponsible: true
            }
          }
        },
        skip: (parseInt(dimensions as string) as number) * (page_number as number),
        take: (parseInt(dimensions as string) as number)
      }),
      prisma.page.findMany({
        where: {
          [date_field as string]: {
            gte: new Date(start_date as string),
            lte: new Date(end_date as string)
          }
        },
        include: {
          Family: {
            include: {
              AdvocateResponsible: true
            }
          }
        }, 
        skip: (parseInt(dimensions as string) as number) * (page_number as number),
        take: (parseInt(dimensions as string) as number)
      }),
    ]);

    return {
      Pagination: {
        total: count,
        total_date_ranged: count_date_ranged
      },
      all_families,
      paginated_pages,
      date_ranged_pages
    }
  } else {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }
})
