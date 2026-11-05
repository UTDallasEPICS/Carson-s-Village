/*	/EditUser/0
*	  function:	POST
*	  submit user account details to database
*/

import { Prisma } from "~~/prisma/generated/client";
import { sendInvite } from "#server/utils/emails/sendInvite.ts";
import { assertCanAddFamilyMember } from "~~/server/utils/familyMemberLimit";

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

  // Family users may only invite family members onto their own family.
  if (user.role === "family") {
    if (!user.familyId) {
      throw createError({
        statusCode: 400,
        message: 'Family user has no family assigned',
      })
    }

    try {
      await assertCanAddFamilyMember(user.familyId)

      delete body.Pages
      delete body.AdvocateFamily

      const userRes = await prisma.user.create({
        data: {
          name: body.name,
          email: body.email,
          phone: body.phone ?? "",
          address: body.address ?? "",
          role: "family",
          familyId: user.familyId,
        },
      })

      await sendInvite(body.email, body.name);
      return { success: true, result: userRes }
    } catch (e: any) {
      if (e?.statusCode) {
        throw e
      }
      console.error(e.message)

      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          throw createError({
            statusCode: 400,
            message: 'User already exists'
          })
        }
      }

      throw createError({
        statusCode: 500,
        message: e.message as unknown as string,
      })
    }
  }

  if(user.role === "advocate" || user.role === "admin") {
    try {
      // creates a new user entry in the user model/table.
      if(body.role === "advocate" || (body.role === "admin" && user.role === "admin")) {
        delete body.Pages
        delete body.AdvocateFamily

        const queryRes = await prisma.user.create({
          data: {
            ...body, id: undefined, familyId: undefined
          }
        });
        
        await sendInvite(body.email, body.name);
        return { success: true, result: queryRes }
      } 
      else if (body.role === "family") {
        if (!body.familyId) {
          throw createError({
            statusCode: 400,
            message: 'Family id is required',
          })
        }

        await assertCanAddFamilyMember(body.familyId)

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

        await sendInvite(body.email, body.name);
        return { success: true, result: queryRes }
      }
    } catch(e: any){
      if (e?.statusCode) {
        throw e
      }
      console.error(e.message)

      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          throw createError({
            statusCode: 400,
            message: 'User already exists'
          })
        }
      }

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
