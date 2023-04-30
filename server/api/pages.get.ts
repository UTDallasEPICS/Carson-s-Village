export default defineEventHandler(async (event) => {
      
      const pages = await prisma.page.findMany({
        where: {
          page_name: {
            contains: searchQuery.value,
            mode: 'insensitive',
          },
        }
      })
    })
    