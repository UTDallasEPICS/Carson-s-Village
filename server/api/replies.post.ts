import type { Reply } from "~/types.d.ts"

export default defineEventHandler(async (event) => {
  const data = await readBody(event)

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
