/*	/EditUser/0
*	  function:	POST
*	  submit family and first user account details to database
*/

const runtime = useRuntimeConfig()

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

  const {
    family_name,
    name,
    email,
    phone, 
    address 
  } = body

  if(user.role === "advocate" || user.role === "admin") {
    try {
      const queryRes = await prisma.family.create({
        data: {
          family_name: family_name,
          AdvocateResponsible: {
            connect: {
              id: user.id
            }
          },
          FamilyMembers: {
            create: {
              name,
              email,
              phone,
              address,
            }
          }
        }
      })

      await sendEmail(body.email, "invitation", "Invitation to Carson's village", ({...body, url: `${runtime.BASEURL}login`}))
      return queryRes
    } catch (e) {
      console.error("An error occured while trying to create family:\n", e)
      throw createError({
        statusCode: 500,
        statusMessage: 'Something went wrong',
        cause: e
      });
    }
  }
  else {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }
})
