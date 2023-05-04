import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
export default defineEventHandler(async (event) => { 
  const {searchQuery} = getQuery(event)
  const pages = await prisma.page.findMany({
    where: {
      page_name: {
        contains: searchQuery as string,
        mode: 'insensitive',
      },
    }
  });
  return pages;
});
    