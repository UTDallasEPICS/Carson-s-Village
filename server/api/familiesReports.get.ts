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
  if (!session || !session.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }
  const user = session.user

  const { page_number, dimensions, start_date, end_date, date_field, family_cuid } = getQuery(event)
  const familyId = Array.isArray(family_cuid) ? family_cuid[0] : family_cuid
  const scopedFamilyId = typeof familyId === 'string' && familyId !== '' && familyId !== '0'
    ? familyId
    : undefined
  const familyFilter = scopedFamilyId ? { familyCuid: scopedFamilyId } : {}
  const dateFilter = {
    [date_field as string]: {
      gte: new Date(start_date as string),
      lte: new Date(end_date as string)
    }
  }

  if(user.role === "advocate"  || user.role === "admin") {
    const [ count, count_date_ranged, all_families, paginated_pages, date_ranged_pages ] = await prisma.$transaction([
      prisma.page.count({
        where: familyFilter
      }),
      prisma.page.count({
        where: {
          ...familyFilter,
          ...dateFilter
        }
      }),
      prisma.family.findMany({
        where: scopedFamilyId ? { id: scopedFamilyId } : undefined,
        include: {
          Pages: true,
          FamilyMembers: true,
          AdvocateResponsible: true
        }
      }),
      prisma.page.findMany({
        where: familyFilter,
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
          ...familyFilter,
          ...dateFilter
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
