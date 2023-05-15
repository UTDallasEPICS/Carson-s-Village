import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

/*
*	/api/image/cuid
*	file:		/Pages/EditPage.vue
*	function:	Delete
*	Deletes family page image from the database.
*/

export default defineEventHandler(async event => {
  const body = await readBody(event)
  const url = body.url
  const page_cuid = body.cuid;
  delete body.cuid;

  try{
  // Creates a new entry in the database in the image model to a specfic image
  const queryRes = await prisma.image.create({
    data: {
      ...body,cuid: undefined,
      User: {
        connect: {
          PageCuid : page_cuid || "0"
        }
      
        }
      }
    });

    return true;
}catch(e){
    console.error();
}
})

