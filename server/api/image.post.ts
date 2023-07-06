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
  //url = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/C751A_depot.jpg/324px-C751A_depot.jpg"
  const page_cuid = body.page_cuid;
  //delete body.cuid;

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

