import type { Page } from "@/types.d.ts"

/*
*	/EditPage/cuid
*	file:		/Pages/EditPage.vue
*	function:	Delete
*	Deletes family page image from the database.
*/

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
  
  if(user.role === "advocate" || user.role == "admin"  || user.role == 'family') {
    try {
      // Deletes an image from the database.
      const queryRes = await prisma.image.delete({
        where: {
          id: body.id as string
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
