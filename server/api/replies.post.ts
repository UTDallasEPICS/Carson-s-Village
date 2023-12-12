import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  //try {
    const {pageCuid, familyCuid, replyData} = await readBody(event)
    console.log(replyData)
    const newReply = await prisma.reply.create({
      data: { ...replyData}
    });

    return {reply: newReply };
  /*} catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }*/
});
