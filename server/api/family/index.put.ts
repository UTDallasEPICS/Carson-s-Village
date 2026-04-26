/*	/EditFamily/cuid
*	  function:	PUT
*	  submit updated family details to database
*/
const runtime = useRuntimeConfig()

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

  const body = await readBody(event);
  const { family_name, familyCuid } = body

  if(user.role === "advocate" || user.role === "admin") {
    try {
      const queryRes = await prisma.family.update({
        where: {
          id: familyCuid as string
        },
        data: {
          family_name: family_name,
        }
      })
      return queryRes
    } catch (e) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to update family ${familyCuid}`
      });
    }
  }
  else {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }
})
