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
  const body = await readBody(event);
  const image = body.image as Image;
try {
    // Deletes an image from the database.
    const queryRes = await prisma.image.delete({
      where: {
          cuid : image.cuid as string
        }
        }
    );

    return queryRes; 
  } catch(e){
  console.log(e)
  } 
});
