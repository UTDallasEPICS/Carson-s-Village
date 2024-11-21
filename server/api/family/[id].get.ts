import {loginRedirectUrl} from "../auth0"

/*
*	/Family
*	function:	GET
*	retrive details of all users in the family from database
*/

export default defineEventHandler(async event => {
  const family_cuid = getRouterParam(event, 'id')
  if( event.context.user?.user_role == "advocate" || event.context.user?.user_role == "admin" || event.context.user?.familyCuid === family_cuid as string){
    const queryRes = await event.context.client.family.findFirst({
        where: { cuid: family_cuid as string },
      include: {
        Pages: true,
        FamilyMembers: true,
        AdvocateResponsible: true
    }
  });
  return queryRes;
  } else {
    return await sendRedirect(event, loginRedirectUrl());
  }
})