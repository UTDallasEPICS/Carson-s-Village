import type { Page } from "@/types.d.ts"

/*
*	/EditPage/cuid
*	file:		/Pages/EditPage.vue
*	function:	Delete
*	Deletes family page image from the database.
*/

export default defineEventHandler(async event => {
  const body = await readBody(event);

  const { user } = await auth.api.getSession({
    headers: event.headers
  })

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }
  
  if(user.role === "advocate" || user.role == "admin"  || user.role == 'family') {
    try {
      // Deletes an image from the database.
      const queryRes = await prisma.image.delete({
        where: {
          id: body.cuid as string
        }
      });
    } catch (e: any) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to delete image ${body.cuid}`
      });
    }
  } else {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }
});
