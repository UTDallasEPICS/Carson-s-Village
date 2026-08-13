/*	/EditFamily/cuid
*	  function:	PUT
*	  submit updated family details to database
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

  const body = await readBody(event);
  const { family_name, familyCuid, advocateCuid } = body

  if(user.role === "advocate" || user.role === "admin") {
    try {
      const result = await prisma.family.update({
        where: {
          id: familyCuid as string
        },
        data: {
          family_name: family_name,
          advocateCuid: advocateCuid
        }
      });

      return result;
    } catch (e: any) {
      console.error(`Failed to update family ${familyCuid}:`, e)

      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        
        // Failed to find advocate id
        if (e.code === "P2003") {
          throw createError({
            statusCode: 400,
            message: 'Failed to connect Advocate'
          })
        }

        // Failed to find advocate or family id
        else if (e.code === "P2025") {
          throw createError({
            statusCode: 400,
            message: `Failed to find ${e.meta?.target || 'Family or Advocate'}`
          })
        }
      }

      throw createError({
        statusCode: 500,
        statusMessage: e?.message
          ? `Failed to update family ${familyCuid}: ${e.message}`
          : `Failed to update family ${familyCuid}`
      });
    }
  }
  else {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }
})
