import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

/*
*	/EditPage/0
*	function:	POST
*	submit family page details to database
*/

export default defineEventHandler(async event => {
  var newCuid = "";
  //extracting family id to connect the page to the authenticated user
  const body = await readBody(event)
  const family_cuid = body.family_cuid;
  delete body.family_cuid;

  try{
  // Creates a new entry in the database in the page model to a specfic user
  const queryRes = await prisma.page.create({
    data: {
      ...body,cuid: undefined,
      User: {
        connect: {
          cuid : family_cuid || "0"
        }
      
        }
      }
    });
    newCuid = queryRes.cuid;
  } catch(error) {
    console.log(error);
  }

    return newCuid;
});


