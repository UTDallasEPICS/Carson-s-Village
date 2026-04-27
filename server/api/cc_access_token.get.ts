import {authRequestUrl} from '~~/server/utils/constant_contacts'

export default defineEventHandler(async event => {
  const session = await auth.api.getSession({
    headers: event.headers
  })
  if (!session || !session.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }
  const user = session.user

  if (user.role === "admin")  {
    const removeToken = await prisma.CC_Token.deleteMany()

    return await sendRedirect(event, authRequestUrl())
  }
  else {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }
})
      
