import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

/*
*	/EditPage/cuid
*	file:		/Pages/EditPage.vue
*	function:	Delete
*	Deletes family page image from the database.
*/

export default defineEventHandler(async event => {
  const body = await readBody(event);
  const url = body.url as string;
try {
    // Deletes an image from the database.
    const queryRes = await prisma.image.deleteMany({
      where: {
          url : url
        }
        }
    );

    return queryRes; 
  } catch(e){
  console.log(e)
  } 
});
