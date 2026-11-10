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
  const query = getQuery(event)
  const status = typeof query.status === 'string' ? query.status : undefined

  if (user.role === 'family') {
    return prisma.familyReferralRequest.findMany({
      where: {
        requesterId: user.id,
        ...(status ? { status: status as 'pending' | 'approved' | 'rejected' } : {})
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  if (user.role === 'admin' || user.role === 'advocate') {
    return prisma.familyReferralRequest.findMany({
      where: status
        ? { status: status as 'pending' | 'approved' | 'rejected' }
        : undefined,
      include: {
        Requester: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  throw createError({
    statusCode: 401,
    statusMessage: 'Unauthorized'
  });
})
