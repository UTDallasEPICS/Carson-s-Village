import type { Reply } from "~/types.d.ts"

export default defineEventHandler(async (event) => {
  const pageId = getRouterParam(event, 'pageId')

  const replies = await prisma.reply.findMany({
    where: {
      pageCuid: pageId
    },
    orderBy: {
      date: 'desc'
    }
  })
  if (!replies) {
    throw createError({
      statusCode: 400,
      statusMessage: `Unable to locate any replies for page ${pageId}`
    })
  }

  return replies as Reply[]
});
