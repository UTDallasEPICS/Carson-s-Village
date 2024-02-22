import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

/*
*	/PageList/cuid
*	function:	POST
*	retrive family pages details from database for a partial or complete page name
*/

export default defineEventHandler(async event => {
const runtime = useRuntimeConfig()
  const { searchQuery, page_number } = await getQuery(event);
  if((searchQuery as string) == "") { 
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
      first_name: {
      contains: searchQuery as string,
      mode: 'insensitive',
    } },
      { last_name: {
        contains: searchQuery as string,
      mode: 'insensitive',
      }}] }}),
    prisma.page.findMany({
  where: {
    OR: [ {
      first_name: {
        contains: searchQuery as string,
        mode: 'insensitive',
      }
    },
    {
      last_name: {
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

  })

