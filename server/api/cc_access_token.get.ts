import {authRequestUrl} from '~~/server/utils/constant_contacts'

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

  if (session.role === "admin")  {
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
      
