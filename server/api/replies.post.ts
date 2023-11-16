import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const {pageCuid, familyCuid, replyData} = await readBody(event)
    
    const newReply = await prisma.reply.create({
      data: {...replyData, pageCuid, familyCuid},
    });

    return {reply: newReply };
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
});
