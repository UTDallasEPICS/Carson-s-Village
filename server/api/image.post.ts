import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

/*
*	/EditPage/cuid (image upload)
*	file:		/Pages/EditPage.vue
*	function:	Delete
*	Deletes family page image from the database.
*/

export default defineEventHandler(async event => {
  const body = await readBody(event)
  const url = body.url
  const page_cuid = body.page_cuid;
  
  try{
  // Creates a new entry in the database in the image model to a specfic image
  const queryRes = await prisma.image.create({
    data: {
      url,
      Page: {
        connect: {
          cuid : page_cuid || "0"
        }
      
        }
      }
    });

    return true;
}catch(e){
    console.error(e);
}
})

