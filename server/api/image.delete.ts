import {loginRedirectUrl} from "../api/auth0"
import type { Page } from "@/types.d.ts"

/*
*	/EditPage/cuid
*	file:		/Pages/EditPage.vue
*	function:	Delete
*	Deletes family page image from the database.
*/

export default defineEventHandler(async event => {
  const body = await readBody(event);

  const pageFound = event.context.user?.Family?.Pages?.find((page:Page) => page.cuid == body.pageCuid) || undefined
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
