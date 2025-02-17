import {loginRedirectUrl} from "../api/auth0"

/*
*	/EditUser/cuid
*	function:	GET
*	retrive authenticated user details from database
*/

export default defineEventHandler(async event => {
  const { cuid } = getQuery(event);
  if( (cuid as string) == "0" || cuid == undefined){
    return []
  }
  // retrieves a single user
  if(event.context.user?.user_role === "advocate" || event.context.user?.user_role === "admin") {
    const queryRes = await event.context.client.user.findFirst({
      where: { cuid: (cuid as string) },
      include: {
        AdvocateFamily: true
      }
    });
    return queryRes;
  } else {
    return await sendRedirect(event, loginRedirectUrl());
  }
})
