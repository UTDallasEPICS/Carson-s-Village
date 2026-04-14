import {loginRedirectUrl} from "../auth0"

/*
*	/Users
*	function:	GET
*	retrive details of all families from database
*/

export default defineEventHandler(async event => {

  if(event.context.user?.user_role === "advocate" || event.context.user?.user_role === "admin") {
    const queryRes = await prisma.family.findMany({
      include: {
        Pages: true,
        FamilyMembers: true,
        AdvocateResponsible: true
      }
    });
    return queryRes;
  } else {
    createError({
      statusCode: 401, 
      statusMessage: "Unauthorized"
    }) 
  }
})
