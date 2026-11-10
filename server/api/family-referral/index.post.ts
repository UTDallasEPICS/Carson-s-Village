import { Prisma } from "~~/prisma/generated/client";
import { TEXT_LIMITS } from '#shared/utils/textLimits'

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
  if (user.role !== 'family') {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }

  const body = await readBody(event)
  const inviteeName = typeof body?.inviteeName === 'string' ? body.inviteeName.trim() : ''
  const inviteeEmail = typeof body?.inviteeEmail === 'string'
    ? body.inviteeEmail.trim().toLowerCase()
    : ''
  const note = typeof body?.note === 'string' ? body.note.trim() : ''

  if (!inviteeName || !inviteeEmail) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invitee name and email are required'
    })
  }

  if (note.length > TEXT_LIMITS.family.invite_note) {
    throw createError({
      statusCode: 400,
      statusMessage: `Note must be ${TEXT_LIMITS.family.invite_note} characters or fewer`
    })
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: inviteeEmail }
  })
  if (existingUser) {
    throw createError({
      statusCode: 400,
      statusMessage: 'A user with this email already exists'
    })
  }

  try {
    return await prisma.familyReferralRequest.create({
      data: {
        inviteeName,
        inviteeEmail,
        note,
        requesterId: user.id,
      }
    })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      throw createError({
        statusCode: 400,
        statusMessage: 'A referral for this email already exists'
      })
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Something went wrong',
      cause: e
    })
  }
})
