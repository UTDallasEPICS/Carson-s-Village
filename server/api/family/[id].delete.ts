/*
*	/Family
*	function:	DELETE
*	Deactivate a family and all it's family users
*/

import { deactivateFamily } from '~~/server/utils/userDeactivation'
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
      statusMessage: 'Require Family Id'
    });
  }

  const family = await prisma.family.findFirst({
    where: {
      id: familyId
    }
  })
  if (!family) {
    throw createError({
      statusCode: 400,
      statusMessage: `Could not find family ID ${familyId}`
    })
  }

  //------ Auth Guard ---------------------------
  if (user.role !== 'admin' && user.role !== 'advocate' && family.advocateCuid !== user.id) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Unauthorized'
    })
  }

  //------ Deactivate Family and Users ----------
  try {
    deactivateFamily(familyId, prisma)
  } catch (err: any) {

    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      throw createError({
        statusCode: 400,
        message: `Failed to find ${err.meta?.target ?? 'some field'}`
      })   
    }
  }
  
})
