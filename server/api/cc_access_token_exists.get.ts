export default defineEventHandler(async event => {

  const { user } = await auth.api.getSession({
    headers: event.headers
  })

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }

  if(user.role === "admin") {
    const accessTokenCount = await prisma.CC_Token.count()
    if(accessTokenCount !== 0) {
      return true
    } else {
      return false
    }
  }
  else {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }
})
  
