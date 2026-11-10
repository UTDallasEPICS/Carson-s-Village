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
  if (user.role !== 'admin' && user.role !== 'advocate') {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing referral id'
    })
  }

  const referral = await prisma.familyReferralRequest.findUnique({
    where: { id }
  })
  if (!referral) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Referral not found'
    })
  }
  if (referral.status !== 'pending') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Referral is not pending'
    })
  }

  return prisma.familyReferralRequest.update({
    where: { id },
    data: {
      status: 'rejected',
      reviewedById: user.id,
      reviewedAt: new Date(),
    }
  })
})
