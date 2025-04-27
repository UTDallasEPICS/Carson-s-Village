import {loginRedirectUrl} from "../api/auth0"
import type { Page } from "@prisma/client" 
/*
*	/EditPage/cuid
*	file:		/Pages/EditPage.vue
*	function:	Delete
*	Deletes family page image from the database.
*/

export default defineEventHandler(async event => {
  const body = await readBody(event);

  const family = await event.context.client.family.findFirst({
    where: { cuid: event.context.user?.familyCuid as string },
      include: {
        Pages: true,
      }
  });

  const pageFound = family?.Pages.find(({ cuid }: Page) => cuid == body.pageCuid || {})
  // todo check here instead of the event context object as it explodes the cookie
try {
  if(event.context.user?.user_role === "advocate" || event.context.user?.user_role == "admin"  || event.context.user?.user_role == 'family' && body.pageCuid == null || pageFound) {
    // Deletes an image from the database.
    const queryRes = await event.context.client.image.delete({
      where: {
          cuid: body.cuid as string
        }
        }
    );

    return true; 
  } else {
    return await sendRedirect(event, loginRedirectUrl());
  }
  } catch(e){
    console.log(e)
  return false;
  } 
});
