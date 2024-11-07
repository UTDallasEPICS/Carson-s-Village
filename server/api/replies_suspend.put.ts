import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const {replyData, suspended} = await readBody(event)
    console.log(replyData)
    const newReply = await prisma.reply.update({ 
        where: { cuid: replyData.cuid } ,
        data: { suspended: suspended } 
    });

    return newReply;
});
