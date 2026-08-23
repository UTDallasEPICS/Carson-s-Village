import type { Prisma } from '../../prisma/generated/client'

type TransactionClient = Prisma.TransactionClient

export async function deactivateFamily(familyId: string, tx: TransactionClient) {
  
  await tx.family.update({
    where: { id: familyId },
    data:  { isActive: false, deactivatedAt: new Date() },
  })

  await tx.user.updateMany({
    where: { familyId: familyId, isActive: true },
    data:  { isActive: false, deactivatedAt: new Date() }
  })

  // Archive all pages for that family
  await tx.page.updateMany({
    where: { familyCuid: familyId, status: 'active' },
    data:  { status: 'inactive' },
  })
}

export async function deactivateUser(userId: string) {
  const target = await prisma.user.findUnique({
    where: { id: userId },
    include: { AdvocateFamily: true },
  })

  if (!target) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  if (!target.isActive) {
    return { success: true, alreadyDeactivated: true }
  }

  if (target.role === 'admin') {
    const activeAdmins = await prisma.user.count({
      where: { role: 'admin', isActive: true, id: { not: userId } },
    })
    if (activeAdmins === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Cannot deactivate the last active admin',
      })
    }
  }

  const shouldDeactivateFamily =
    target.role === 'family'
    && target.familyId
    && (await prisma.user.count({
      where: {
        familyId: target.familyId,
        role: 'family',
        isActive: true,
      },
    })) === 1

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: { isActive: false, deactivatedAt: new Date() },
    })

    await tx.session.deleteMany({ where: { userId } })

    if (target.role === 'advocate') {
      await tx.family.updateMany({
        where: { advocateCuid: userId },
        data: { advocateCuid: null },
      })
    }

    if (shouldDeactivateFamily && target.familyId) {
      await deactivateFamily(target.familyId, tx)
    }
  })

  return { success: true }
}

export async function reactivateUser(userId: string) {
  const target = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!target) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  if (target.isActive) {
    return { success: true, alreadyActive: true }
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      isActive: true,
      deactivatedAt: null,

      Family: {
        update: {
          isActive: true,
        },
      },
    },
  })

  return { success: true }
}
