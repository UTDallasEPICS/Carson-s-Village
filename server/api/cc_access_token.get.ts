import {authRequestUrl} from './constant_contacts'

export default defineEventHandler(async event => {
  if (event.context.user?.user_role === "admin")  {
    const removeToken = await prisma.CC_Token.deleteMany()

    await sendRedirect(event, authRequestUrl())
  }

  createError({
    statusCode: 401, 
    statusMessage: "Unauthorized"
  }) 
})
      
