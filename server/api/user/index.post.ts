/*	/EditUser/0
*	  function:	POST
*	  submit user account details to database
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

  const body = await readBody(event)

  if(user.role === "advocate" || user.role === "admin") {
    try{
      // creates a new user entry in the user model/table.
      if(body.role === "advocate" || (body.role === "admin" && user.role === "admin")) {
        delete body.Pages
        delete body.AdvocateFamily
        const queryRes = await prisma.user.create({
          data: {
            ...body, id: undefined, familyId: undefined
            }
          });
        
          await sendEmail(body.email, "invitation", "Invitation to Carson's village", ({...body, url: `${runtime.BASEURL}login`}))
          return { success: true, result: queryRes }
      } 
      else if (body.role === "family") {
        delete body.Pages
        delete body.AdvocateFamily

        const userRes = await prisma.user.create({
          data: {
            ...body, id: undefined,
          }
        })

        const queryRes = await prisma.family.update({
          where: { id: body.familyId },
          data: {
            FamilyMembers: {
              connect: {
                id: userRes.id
              }
            }, 
          }
        })

        await sendEmail(body.email, "invitation", "Invitation to Carson's village", ({...body, url: `${runtime.BASEURL}login`}))
        return { success: true, result: queryRes }
      }
         
      } catch(e: any){
        let error = e as string || undefined
        throw createError({
          statusCode: 500,
          message: e.message as unknown as string,
        })
      }
  } else{
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }
})
