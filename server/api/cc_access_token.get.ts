export default defineEventHandler(async event => {
    if(event.context.user?.user_role === "admin") {
        const accessToken = await event.context.client?.CC_Token.findFirst({
            where: {
                cuid: "0"
            }
        })
        return true    
    }

    createError({
        statusCode: 403, 
        statusMessage: "Unauthorized"
    }) 
})
  