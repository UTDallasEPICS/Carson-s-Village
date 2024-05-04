import { PrismaClient } from "@prisma/client"
import type { Page } from '@/types.d.ts'
const prisma = new PrismaClient()

/*
*    /PageList/cuid
*    function:    POST
*    retrive family pages details from database for a partial or complete page name
*/

export default defineEventHandler(async event => {
const runtime = useRuntimeConfig()

if(event.context.user.cuid != undefined) { //if the user is not logged in, do not let them see all the pages
  const { searchQuery, page_number, isPageList, order, sortedColumn } = getQuery(event);
  if((searchQuery as string) == "" && event.context.user.user_role == "admin" && (isPageList == 1) as boolean) { 
    const [count, pagesResult] = await prisma.$transaction([
      prisma.page.count(),
      prisma.page.findMany({
      skip: page_number as number * 12,
      take: 12,
    })
    ])
    return {
      Pagination: {
      total:  count
      }, 
      data:  pagesResult
    };
  }


  const searchQuerySpacesRemoved = (searchQuery as string).replaceAll(" ", "")
  // Makes sure that an empty searchQuery returns no results and that searchQueries with all spaces return no results (prevents returning all pages with a first and last name using a space).
  if((searchQuery as string) != "" && searchQuerySpacesRemoved.length != 0) {
    // Pagination via taking the absolute page number with 12 records per page 
    const [count, pagesResult, unsortedPages] = await prisma.$transaction([
      prisma.page.count({
        where: {
          OR: [ { 
            page_first_name: {
            contains: searchQuery as string,
          mode: 'insensitive',
        } },
          { page_last_name: {
            contains: searchQuery as string,
          mode: 'insensitive',
          }}] 
        }}),
      prisma.page.findMany({
    orderBy: {
      [(sortedColumn as string) || 'page_last_name'] : (order as string) || 'asc'
      } as const,
    where: {
      OR: [ { 
        page_first_name: {
        contains: searchQuery as string,
      mode: 'insensitive',
    } },
      { page_last_name: {
        contains: searchQuery as string,
      mode: 'insensitive',
      }}]
    },
    skip: page_number as number * 12,
    take: 12, 
  }),
      prisma.page.findMany({
    where: {
      OR: [ { 
        page_first_name: {
        contains: searchQuery as string,
      mode: 'insensitive',
    } },
      { page_last_name: {
        contains: searchQuery as string,
      mode: 'insensitive',
      }}] 
    }}),
    prisma.page.findMany({
  where: {
    OR: [ {
      page_first_name: {
        contains: searchQuery as string,
        mode: 'insensitive',
      }
    },
    { page_last_name: {
      contains: searchQuery as string,
    mode: 'insensitive',
    }}]
  },
    skip: page_number as number * 12,
    take: 12, 
  })  
    ])
    
    return {
      Pagination: {
      total: count },
      data:  pagesResult,
      unsorted_data: unsortedPages
    };
  }

  return {
    Pagination: {
    total: 0
    }, 
    data:  [],
    unsorted_data: []
  };
}
})
