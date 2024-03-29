import { PrismaClient } from "@prisma/client"
import {loginRedirectUrl} from "../api/auth0"
const prisma = new PrismaClient()

/*  /EditUser/cuid
*	  function:	PUT
*	  submit user account details to database
*/

export default defineEventHandler(async event => {
const {pages, ...body} = await readBody(event);
//delete body.pages
if(event.context.user?.user_role == "advocate"  || event.context.user.user_role === "admin"){
  // updates the user
  try { 
    const queryRes = await prisma.user.update({
      where: {
        cuid: body.cuid
      },
      data: {
        ...body     
      }  
        });

      return true;
    } catch(e) {
      console.log(e)
    }
} else {
  return await sendRedirect(event, loginRedirectUrl());
}
})
