import type { Reply } from "~/types.d.ts"

export default defineEventHandler(async (event) => {
    const {pageCuid, familyCuid, replyData} = await readBody(event)
    console.log(replyData._value)
    let newReply: Reply = {
      cuid: "",
      pageCuid: "",
      familyCuid: "",
      name: "",
      reply: "",
      date: undefined,
      suspended: false
    }
    
    try {
      newReply = await event.context.client.reply.create({
        data: { ...replyData._value}
      }) as unknown as Reply
    } catch(error) {
      console.error(error)
    }

    return newReply;
});
