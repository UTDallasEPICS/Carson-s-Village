import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  //try {
    const {pageCuid, familyCuid,replyData} = await readBody(event)
    console.log(replyData._value)
    const newReply = await prisma.reply.create({
      data: { ...replyData._value}
    });

    return newReply;
  /*} catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }*/
});
