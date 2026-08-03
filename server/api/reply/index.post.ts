import type { Reply } from "~/types.d.ts"

export default defineEventHandler(async (event) => {
  const data = await readBody(event)

  const page = await prisma.page.findUnique({ where: { id: data.pageCuid } })
  if (!page || page.status !== 'active') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Cannot comment on an archived page',
    })
  }

  try {
    const newReply = await prisma.reply.create({
      data: { ...data}
    }) as unknown as Reply

    return newReply;
  } catch(error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Something went wrong',
      cause: error
    });
  }

});
