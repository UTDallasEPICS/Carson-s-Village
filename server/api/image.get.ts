import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

/*
*	/EditPage/cuid or /Page/cuid
*	function:	POST
*	retrive family page images from database
*/


export default defineEventHandler(async event => {
  const body = await readBody(event);
  const page_cuid = body.page_cuid as string;

try {
    // retrives all the images that belong to a family page to a family page
    const queryRes = await prisma.image.findMany({
      where: {
          pageCuid : page_cuid
        }
        }
    );
    return queryRes; 
  } catch(e){
  console.log(e)
  }


    
});