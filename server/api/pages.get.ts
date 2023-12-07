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
  if((searchQuery as string) ==""){
    return await prisma.page.findMany({
      skip: page_number as number * 12,
      take: 12
    })
  }
  console.log(page_number)
  const pagesResult = await prisma.page.findMany({
  where: {
  page_name: {
    contains: searchQuery as string,
    mode: 'insensitive',
  }
  },
  skip: page_number as number * 12,
  take: 12
})
  return pagesResult;
  })

