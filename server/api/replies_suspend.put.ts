export default defineEventHandler(async (event) => {
  //try {
    const {replyData, suspended} = await readBody(event)
    console.log(replyData)
    const newReply = await event.context.client.reply.update({ 
        where: { cuid: replyData.cuid } ,
        data: { suspended: suspended } 
    });

    return newReply;
  /*} catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }*/
});
