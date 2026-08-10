/*
 * function: PUT
 * Admin-only: reactivate a deactivated user
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

  return reactivateUser(userId)
})
