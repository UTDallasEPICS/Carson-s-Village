import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

/*  /EditUser/cuid
*	  function:	PUT
*	  submit user account details to database
*/

export default defineEventHandler(async event => {
const body = await readBody(event);

// updates the user
try{ 
//if(event.context.user.user_role === "advocate"){
  const queryRes = await prisma.user.update({
    where: {
      cuid: body.cuid
    },
    data: {
      ...body     
    }  
      });

    return true;
//}
  } catch(e){
    console.log(e)
  }
})
