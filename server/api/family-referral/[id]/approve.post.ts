import { Prisma } from "~~/prisma/generated/client";
import { sendInvite } from "#server/utils/emails/sendInvite.ts";

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

  const existingUser = await prisma.user.findUnique({
    where: { email: referral.inviteeEmail }
  })
  if (existingUser) {
    throw createError({
      statusCode: 400,
      statusMessage: 'A user with this email already exists'
    })
  }

  try {
    const family = await prisma.$transaction(async (tx) => {
      const created = await tx.family.create({
        data: {
          family_name: referral.inviteeName,
          AdvocateResponsible: {
            connect: { id: user.id }
          },
          FamilyMembers: {
            create: {
              name: referral.inviteeName,
              email: referral.inviteeEmail,
            }
          }
        },
        include: {
          FamilyMembers: true,
        }
      })

      await tx.familyReferralRequest.update({
        where: { id },
        data: {
          status: 'approved',
          reviewedById: user.id,
          reviewedAt: new Date(),
        }
      })

      return created
    })

    await sendInvite(referral.inviteeEmail, referral.inviteeName)
    return family
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      throw createError({
        statusCode: 400,
        statusMessage: 'User already exists'
      })
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Something went wrong',
      cause: e
    })
  }
})
