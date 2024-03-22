import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

/*
*	/PageList/cuid
*	function:	POST
*	retrive family pages details from database for a partial or complete page name
*/

export default defineEventHandler(async event => {
const runtime = useRuntimeConfig()
if(event.context.user.cuid != undefined) { //if the user is not logged in, do not let them see all the pages
  const { searchQuery, page_number, isPageList } = getQuery(event);
  if((searchQuery as string) == "" && event.context.user.user_role == "admin" && (isPageList == 1) as boolean) { 
    const [count, pagesResult] = await prisma.$transaction([
      prisma.page.count(),
      prisma.page.findMany({
      skip: page_number as number * 12,
      take: 12
    })
    ])
    return {
      Pagination: {
      total:  count
      }, 
      data:  pagesResult
    };
  }

  console.log(page_number)
  
  // Pagination via taking the absolute page number with 12 records per page 
  // Transaction is a Database thing
  // You can get away with doing multiple operations at once. 
  // count gets the amount of pages with the same name
  // 
  const [count, pagesResult] = await prisma.$transaction([
    prisma.page.count({ where: { 
      OR: [ {
      page_first_name: {
      contains: searchQuery as string,
      mode: 'insensitive',
    } },
      { page_last_name: {
        contains: searchQuery as string,
      mode: 'insensitive',
      }}] }}),
    prisma.page.findMany({
  where: {
    OR: [ {
      page_first_name: {
        contains: searchQuery as string,
        mode: 'insensitive',
      }
    },
    {
      page_last_name: {
        contains: searchQuery as string,
        mode: 'insensitive',
      }
    }
    ]
  },
  skip: page_number as number * 12,
  take: 12, 
})
  ])


    return {
      Pagination: {
      total: count },
      data:  pagesResult
    };
  }
  return {
    Pagination: {
    total: 0
    }, 
    data:  []
  };
} 
  return {
    Pagination: {
    total: 0
    }, 
    data:  []
  };
  })
