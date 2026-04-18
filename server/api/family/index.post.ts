/*	/EditUser/0
*	  function:	POST
*	  submit family and first user account details to database
*/

const runtime = useRuntimeConfig()
export default defineEventHandler(async event => {
  const { user } = await auth.api.getSession({
    headers: event.headers
  })

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }

  const EmailTemplates = new emailTemplates({
    views: {
      root: "./emails",
    },
    juice: true,
    juiceResources: {
      preserveImportant: true,
      webResources: {
        relativeTo: "./emails",
      },
    },
  })

  const body = await readBody(event);

  const {
    family_name,
    first_name,
    email,
    middle_name,
    last_name,
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
              name: `${first_name ? first_name : ''}${middle_name ? middle_name : ' '}${last_name}`,
              email,
              phone,
              address,
            }
          }
        }
      })

      // Refactor to use new login
      await sendEmail(body.email, "invitation", "Invitation to Carson's village", ({...body, url: `${runtime.BASEURL}api/login`}))
      return queryRes
    } catch (e) {
      console.error(e)
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
