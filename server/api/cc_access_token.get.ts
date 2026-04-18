import {authRequestUrl} from '~~/server/utils/constant_contacts'

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

  if (user.role === "admin")  {
    const removeToken = await prisma.CC_Token.deleteMany()

    await sendRedirect(event, authRequestUrl())
  }
  else {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }
})
      
