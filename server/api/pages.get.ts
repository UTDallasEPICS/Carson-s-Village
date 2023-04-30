import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default defineEventHandler(event => {
  const body = readBody(event);
  const searchQuery = event.context.searchQuery;
  const pagesResult = prisma.page.findMany({
  where: {
  page_name: {
    contains: searchQuery.value,
    mode: 'insensitive',
  },
  }
})
  return pagesResult;
  })

