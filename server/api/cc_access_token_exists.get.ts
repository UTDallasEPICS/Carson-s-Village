export default defineEventHandler(async event => {
    if(event.context.user?.user_role === "admin") {
            const accessTokenCount = await event.context.client?.CC_Token.count()
            if(accessTokenCount !== 0) {
                return true
            } else {
                return false
            }
    }

    createError({
        statusCode: 401, 
        statusMessage: "Unauthorized"
    }) 
})
  