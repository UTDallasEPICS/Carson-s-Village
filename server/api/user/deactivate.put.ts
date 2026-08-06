/*
 * function: PUT
 * Admin-only: deactivate a user and apply cascade rules
 */

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  })

  if (!session?.user || session.user.role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
    })
  }

  const body = await readBody(event)
  const userId = body?.id as string

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User id is required',
    })
  }

  if (userId === session.user.id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Cannot deactivate your own account',
    })
  }

  return deactivateUser(userId)
})
