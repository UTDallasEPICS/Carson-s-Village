import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

/*
*	/PageList/cuid
*	function:	POST
*	retrive family pages details from database for a partial or complete page name
*/

export default defineEventHandler(async event => {
  const { searchQuery } = await getQuery(event);
  
  const pagesResult = prisma.page.findMany({
  where: {
  page_name: {
    contains: searchQuery as string,
    mode: 'insensitive',
  },
  }
})
  return pagesResult;
  })

