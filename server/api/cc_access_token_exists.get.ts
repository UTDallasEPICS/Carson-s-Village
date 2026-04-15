export default defineEventHandler(async event => {
  const session = await auth.api.getSession({
    headers: event.headers
  })

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }

  if(session.role === "admin") {
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
  
