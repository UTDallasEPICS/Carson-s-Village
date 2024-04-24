import { PrismaClient } from "@prisma/client"
import {loginRedirectUrl} from "../api/auth0"
const prisma = new PrismaClient()

/*  /EditUser/cuid
*	  function:	PUT
*	  submit user account details to database
*/

export default defineEventHandler(async event => {
const body = await readBody(event);
//delete body.pages
if(event.context.user?.user_role == "advocate"  || event.context.user.user_role === "admin"){
  // updates the user
  try { 
    //changing families that a user belongs to and or other details
    if(body.user_role == 'family' && body.familyCuid !== '') {
      const queryRes = await prisma.user.update({
        where: {
          cuid: body.cuid
        },
        data: {
          first_name: body.first_name,
          middle_name: body.middle_name,
          last_name: body.last_name,
          user_role: 'family',
          familyCuid: body.familyCuid || null,
          phone: body.phone,
          //...body
  
        }  
          });
    } else {
    const queryRes = await prisma.user.update({
      where: {
        cuid: body.cuid
      },
      data: {
        first_name: body.first_name,
        middle_name: body.middle_name,
        last_name: body.last_name,
        user_role: body.user_role,
        phone: body.phone
        //...body

      }
    })
  }
      return true;
    } catch(e) {
      console.log(e)
      return false
    }
} else {
  return await sendRedirect(event, loginRedirectUrl());
}
})
