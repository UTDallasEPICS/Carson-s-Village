/*
*	/Family
*	function:	DELETE
*	Deactivate a family and all it's family users
*/

import { Prisma } from "~~/prisma/generated/client";

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

  const familyId = getRouterParam(event, 'id')
  if (!familyId) {
    throw createError({
      statusCode: 400,
      message: 'Require Family Id'
    });
  }

  const family = await prisma.family.findFirst({
    where: {
      id: familyId
    }
  })
  if (!family) {
    console.log(`Could not find family ID ${familyId}`)
    throw createError({
      statusCode: 400,
      message: `Could not find family ID ${familyId}`
    })
  }

  //------ Auth Guard ---------------------------
  if (
    user.role !== 'admin' &&
    !(user.role === 'advocate' && family.advocateCuid === user.id)
  ) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Unauthorized'
    })
  }

  //------ Reactivate Family --------------------
  try {

    await prisma.family.update({
      where: { id: familyId },
      data:  { isActive: true, deactivatedAt: null }
    })
  } catch (err: any) {

    console.log(`Error reactivating family ${familyId}:`, err.message)
    throw createError({
      statusCode: 500,
      message: 'Failed to reacitivate family'
    })
  }
})
