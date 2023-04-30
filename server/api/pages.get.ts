import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default defineEventHandler(event => {
  const body = readBody(event);
  const pagesResult = prisma.page.findMany({
    where: {
      page_name: {
        contains: body.searchQuery,
        mode: 'insensitive',
      },
    }
  })
  return pagesResult;
})
