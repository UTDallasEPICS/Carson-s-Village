import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  //try {
    const {replyData} = await readBody(event)
    console.log(replyData._value)
    const newReply = await prisma.reply.update({ 
        where: { cuid: replyData._value.cuid } ,
        data: { suspended: replyData._value.suspended }
    });

    return newReply;
  /*} catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }*/
});
