import { PrismaClient } from "@prisma/client"
import type { Image, Page, User } from '@/types.d.ts'
import {loginRedirectUrl} from "../api/auth0"
const prisma = new PrismaClient()

/*
*	/EditPage/cuid
*	file:		/Pages/EditPage.vue
*	function:	Delete
*	Deletes family page image from the database.
*/

export default defineEventHandler(async event => {
  const body = await readBody(event);

try {
  if(event.context.user?.user_role === "advocate" || event.context.user?.user_role == "admin" || body.pageCuid === event.context.user?.cuid) {
    // Deletes an image from the database.
    const queryRes = await prisma.image.delete({
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
