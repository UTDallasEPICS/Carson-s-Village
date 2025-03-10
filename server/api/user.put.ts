import {loginRedirectUrl} from "../api/auth0"
import type { Family } from "@/types.d.ts"
/*  /EditUser/cuid
*	  function:	PUT
*	  submit user account details to database
*/

export default defineEventHandler(async event => {
const body = await readBody(event);
//delete body.pages
const familyCuidList = body.AdvocateFamily.map((Family: Family) => ({ cuid: Family.cuid }))
console.log(body.allFamilies)
const allFamilyCuidList = body.allFamilies.map((Family: Family) => ({ cuid: Family.cuid }))
delete body.AdvocateFamily
if(event.context.user?.user_role == "advocate" || event.context.user?.user_role === "admin"){
  if(event.context.user.cuid === body.cuid && event.context.user.email !== body.email) {
    throw createError({
      statusCode: 500,
      message: "Can not change account email while signed in (logout first and then have Jason change it)",
    })
  }
  // updates the user
  try { 
    // changing families that a user belongs to and/or other details
    // todo: reinvite users who change their emails
    // todo: add security advocates can change those that they are responsible for
    // todo: change api to use a more standard format. Here we specify the fields of the body instead of using ...body because ...body breaks here
    if(body.user_role == 'family' && body.familyCuid) {
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
    } else if(body.user_role == 'family' && !body.familyCuid) {
      const now = new Date()
      const familyRes = await event.context.client.family.create({
        data: {
          cuid: undefined,
          family_name: body.family_name,
          updated_at: now,
          created_at: now,
          AdvocateResponsible: {
            connect: { cuid: event.context.user?.cuid }
          },
        }
      })
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
          familyCuid: familyRes.cuid,
          phone: body.phone,
          address: body.address
          //...body
  
        }  
          });
    } else {
      //todo mark family as unasssigned
      const replaceUsers = await event.context.client.$transaction([
         event.context.client.user.update({
          where: {
            cuid: body.cuid
          },
          data: {
            AdvocateFamily: {
              disconnect: allFamilyCuidList
            }
          }
         }),
         event.context.client.user.update({
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
            address: body.address,
            AdvocateFamily: {
              connect: familyCuidList
            }
            //...body
    
          }, 
        })

      ])

    return { success: true, result: "success" }
    }
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
