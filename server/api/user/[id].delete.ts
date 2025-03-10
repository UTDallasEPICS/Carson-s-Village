import {logoutRedirectUrl} from "../../api/auth0"
import type { Family } from "@/types.d.ts"
/*  /EditUser/cuid
*	  function:	PUT
*	  submit user account details to database
*/

export default defineEventHandler(async event => {
const id = getRouterParam(event, 'id')
const body = await readBody(event);
const cvtoken = getCookie(event, "cvtoken") || ""
if(event.context.user?.user_role == "advocate" || event.context.user?.user_role === "admin"){
    if(body.user_role == 'family' || (body.user_role == 'admin' && event.context.user?.user_role === "admin") || (body.user_role == 'advocate' && event.context.user?.user_role === "admin")) {
      const queryRes = await event.context.client.user.update({
        where: {
          cuid: id
        },
        data: {
            isActive: false
        }  
          });
      return true
    }

    return false
} else {
  return await sendRedirect(event, logoutRedirectUrl(cvtoken));
}
})
