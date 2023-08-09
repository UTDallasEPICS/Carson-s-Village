import { PrismaClient } from "@prisma/client"
import type { Image, Page, User } from '@/types.d.ts'
const prisma = new PrismaClient()

/*
*	/EditPage/cuid
*	file:		/Pages/EditPage.vue
*	function:	Delete
*	Deletes family page image from the database.
*/

export default defineEventHandler(async event => {
  const {cuid} = await readBody(event);
  if(event.context.user.cuid != ""){ 
  // event.context.user.user_role === "advocate" || body.pageCuid === event.context.user.cuid
try {
    // Deletes an image from the database.
    const queryRes = await prisma.image.delete({
      where: {
          cuid
        }
        }
    );

    return true; 
  } catch(e){
  console.log(e)
  return false;
  } 
  }
});
