/*  /EditUser/cuid
*	  function:	PUT
*	  submit user account details to database
*/

export default defineEventHandler(async event => {
  const session = await auth.api.getSession({
    headers: event.headers
  })

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }
  const body = await readBody(event);
  
  //delete body.pages
  if(session.role == "advocate"  || session.role === "admin") {
    // updates the user
    try { 
      //changing families that a user belongs to and or other details
      // todo: reinvite users who change their emails
      // todo: add security so that admins can change any user, advocates can change those that they are responsible for, and users should not be able to change their own email (or stuff breaks obviously).
      // todo: change api to use a more standard format. Here we specify the fields of the body instead of using ...body because ...body breaks here
      if(body.user_role == 'family' && body.familyCuid !== '') {
        const queryRes = await prisma.user.update({
          where: {
            id: body.cuid
          },
          data: {
            email: body.email,
            name: `${body.first_name} ${body.middle_name} ${body.last_name}`,
            role: 'family',
            familyId: body.familyCuid || null,
            phone: body.phone,
            //...body
    
          }  
            });
      } else {
        const queryRes = await prisma.user.update({
          where: {
            id: body.cuid
          },
          data: {
            email: body.email,
            name: `${body.first_name} ${body.middle_name} ${body.last_name}`,
            role: body.user_role,
            phone: body.phone,
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
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }
})
