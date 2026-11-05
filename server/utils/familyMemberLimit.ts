import {
  FAMILY_MEMBER_LIMIT_MESSAGE,
  MAX_FAMILY_MEMBERS,
} from '#shared/utils/familyLimits'

/**
 * Counts family-role users on a family (active and inactive).
 * Throws 400 when adding one more would exceed MAX_FAMILY_MEMBERS.
 */
export async function assertCanAddFamilyMember(familyId: string) {
  if (!familyId) {
    throw createError({
      statusCode: 400,
      message: 'Family id is required',
    })
  }

  const count = await prisma.user.count({
    where: {
      familyId,
      role: 'family',
    },
  })

  if (count >= MAX_FAMILY_MEMBERS) {
    throw createError({
      statusCode: 400,
      message: FAMILY_MEMBER_LIMIT_MESSAGE,
    })
  }
}
