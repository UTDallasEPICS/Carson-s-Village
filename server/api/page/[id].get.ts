export default defineEventHandler(async event => {
  const pageId = getRouterParam(event, 'id')

  if (pageId === '0' || pageId === undefined) {
    throw createError({
      statusCode: 400,
      statusMessage: `Page ID ${pageId} is not allowed`
    });
  }

  const page = await prisma.page.findUnique({
    where: {
      id: pageId
    },
    include: {
      Images: true,
      PageDonations: {
        orderBy: {
          donationInitiated: 'desc'
        },
      },
      Reply: {
        orderBy: {
          date: 'desc'
        }
      }
    }
  });
  
  if (!page) {
    throw createError({
      statusCode: 500,
      statusMessage: `Unable to retrieve Page ID ${pageId}`
    })
  }

  return page
})
