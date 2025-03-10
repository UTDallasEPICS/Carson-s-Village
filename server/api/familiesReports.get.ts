import {loginRedirectUrl} from "./auth0"
import type { User, Family, Page } from "@/types.d.ts"

/*
*	/Users
*	function:	GET
*	retrive details of all families from database for the purpose of family reports
*/

export default defineEventHandler(async event => {
  const { page_number, dimensions, start_date, end_date, date_field, familyCuid } = getQuery(event)
  const start_date_date = start_date as Date
  const end_date_date = end_date as Date
  if(event.context.user?.user_role === "advocate"  || event.context.user?.user_role === "admin") {
    const [ count, count_family, count_family_date_ranged, count_date_ranged, all_families, paginated_pages, date_ranged_pages, paginated_pages_family_date_ranged, paginated_pages_family ] = await event.context.client.$transaction([
      event.context.client.page.count(),
      event.context.client.page.count({
        where: {
          Family: {
            cuid: familyCuid as string
          }
        }
      }),
      event.context.client.page.count({
        where: {
          Family: {
            cuid: familyCuid as string
          },
          [date_field as string]: {
            gte: new Date(start_date as string),
            lte: new Date(end_date as string)
          } 
        }
      }),
      event.context.client.page.count({ where: {
        [date_field as string]: {
          gte: new Date(start_date as string),
          lte: new Date(end_date as string)
        } 
      }}),
      event.context.client.family.findMany({
        include: {
          Pages: true,
          FamilyMembers: true,
          AdvocateResponsible: true
        }}),
        event.context.client.page.findMany({
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
      event.context.client.page.findMany({
        include: {
          Family: {
            include: {
              AdvocateResponsible: true
            }
          }
        }, where: {
            [date_field as string]: {
                gte: new Date(start_date as string),
                lte: new Date(end_date as string)
          }
        },
      skip: (parseInt(dimensions as string) as number) * (page_number as number),
      take: (parseInt(dimensions as string) as number)
    }),
    event.context.client.page.findMany({
      include: {
        Family: {
          include: {
            AdvocateResponsible: true
          }
        }
      }, where: {
        [date_field as string]: {
          gte: new Date(start_date as string),
          lte: new Date(end_date as string)
    },
        Family: {
          cuid: familyCuid as string
        }
      },
    skip: (parseInt(dimensions as string) as number) * (page_number as number),
    take: (parseInt(dimensions as string) as number)
  }),
  event.context.client.page.findMany({
    include: {
      Family: {
        include: {
          AdvocateResponsible: true
        }
      }
    }, where: {
      Family: {
        cuid: familyCuid as string
      }
    },
  skip: (parseInt(dimensions as string) as number) * (page_number as number),
  take: (parseInt(dimensions as string) as number)
}),
    
  ]);

  //console.log(date_ranged_pages)
  console.log(date_field as string)
  return {
   Pagination: {
    total: count,
    total_family: count_family,
    total_family_date_ranged: count_family_date_ranged,
    total_date_ranged: count_date_ranged
   },
   all_families,
   paginated_pages,
   date_ranged_pages: date_ranged_pages,
   date_ranged_pages_family: paginated_pages_family_date_ranged ,
   paginated_pages_family: paginated_pages_family ,
  }
  } else {
    return await sendRedirect(event, loginRedirectUrl());
  }
})