/*  /EditUser/cuid
*	  function:	PUT
*	  submit user account details to database
*/

export default defineEventHandler(async event => {
  const session = await auth.api.getSession({
    headers: event.headers
  })
  if (!session || !session.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }
  const user = session.user

  const body = await readBody(event);
  
  if(user.role == "advocate"  || user.role === "admin") {
    // updates the user
    try { 
      //changing families that a user belongs to and or other details
      // todo: reinvite users who change their emails
      // todo: add security so that admins can change any user, advocates can change those that they are responsible for, and users should not be able to change their own email (or stuff breaks obviously).
      // todo: change api to use a more standard format. Here we specify the fields of the body instead of using ...body because ...body breaks here
      if(body.role == 'family' && body.familyId !== '') {
        const queryRes = await prisma.user.update({
          where: {
            id: body.id
          },
          data: {
            email: body.email,
            name: body.name,
            role: 'family',
            familyId: body.familyId || null,
            phone: body.phone,
          }  
            });
      } else {
        const queryRes = await prisma.user.update({
          where: {
            id: body.id
          },
          data: {
            email: body.email,
            name: body.name,
            role: body.role,
            phone: body.phone,
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
