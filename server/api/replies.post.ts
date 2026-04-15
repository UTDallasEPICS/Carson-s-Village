import type { Reply } from "~/types.d.ts"

export default defineEventHandler(async (event) => {
    const {pageCuid, familyCuid, replyData} = await readBody(event)

    try {
      const newReply = await prisma.reply.create({
        data: { ...replyData._value}
      }) as unknown as Reply
    } catch(error) {
      console.error(error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Something went wrong',
        cause: error
      });
    }

    return newReply;
});
