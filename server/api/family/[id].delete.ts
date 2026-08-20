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

  //------ Deactivate Family and Users ----------
  try {
    deactivateFamily(familyId, prisma)
  } catch (err: any) {

    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      console.log(`Failed to find ${err.meta?.target ?? 'some unknown field'}`)
      throw createError({
        statusCode: 400,
        message: `Failed to find ${err.meta?.target ?? 'some unknown field'}`
      })   
    }

    console.log(`Error deactivating family ${familyId}:`, err.message)
      throw createError({
        statusCode: 400,
        message: `Error deactivating family ${familyId}:`
      })   
  }
  
})
