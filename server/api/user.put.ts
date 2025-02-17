import {loginRedirectUrl} from "../api/auth0"

/*  /EditUser/cuid
*	  function:	PUT
*	  submit user account details to database
*/

export default defineEventHandler(async event => {
const body = await readBody(event);
//delete body.pages
if(event.context.user?.user_role == "advocate"  || event.context.user?.user_role === "admin"){
  // updates the user
  try { 
    //changing families that a user belongs to and or other details
    // todo: reinvite users who change their emails
    // todo: add security so that admins can change any user, advocates can change those that they are responsible for, and users should not be able to change their own email (or stuff breaks obviously).
    // todo: change api to use a more standard format. Here we specify the fields of the body instead of using ...body because ...body breaks here
    if(body.user_role == 'family' && body.familyCuid !== '') {
      const queryRes = await event.context.client.user.update({
        where: {
          cuid: body.cuid
        },
        data: {
          email: body.email,
          first_name: body.first_name,
          middle_name: body.middle_name,
          last_name: body.last_name,
          user_role: 'family',
          familyCuid: body.familyCuid || null,
          phone: body.phone,
          address: body.address
          //...body
  
        }  
          });
    } else {
    const queryRes = await event.context.client.user.update({
      where: {
        cuid: body.cuid
      },
      data: {
        email: body.email,
        first_name: body.first_name,
        middle_name: body.middle_name,
        last_name: body.last_name,
        user_role: body.user_role,
        phone: body.phone,
        address: body.address
        //...body

      }
    })
  }
    return { success: true, result: "success" }
  } catch(e: any) {
    console.error(e);
    throw createError({
      statusCode: 500,
      message: e.message as unknown as string,
    })
  }
} else {
  return await sendRedirect(event, loginRedirectUrl());
}
})
