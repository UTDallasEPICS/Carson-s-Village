import type { Image } from "@/types.d.ts"
import {loginRedirectUrl} from "../api/auth0"

/*
*	/EditPage/0
*	function:	POST
*	submit family page details to database
*/

export default defineEventHandler(async event => {
  // extracting family id to connect the page to the authenticated user
  const {Images, Reply, PageDonations, userCuid, familyCuid, ...data} = await readBody(event)

  if(event.context.user?.user_role === "advocate" || event.context.user?.user_role == 'admin'|| event.context.user?.cuid === userCuid ) {
    data.donation_goal = Math.trunc(data.donation_goal * 100);
    data.amount_raised = Math.trunc(data.amount_raised * 100);
    try {
      const family = await event.context.client.family.findFirst({
        where: { cuid: familyCuid as string }
      })

      data.status = family?.stripe_account_id ? 'active' : 'no family stripe account'
      // Creates a new entry in the database in the page model to a specfic user
      const queryRes = await event.context.client.page.create({
        data: {
          ...data, cuid: undefined,
          User: {
            connect: {
              cuid : userCuid
            }
          },
          Family: {
            connect: {
              cuid: familyCuid
            }
          }
            }
          });

        // Initially the images are not linked to a family page, so we add it here 
        // Reason: the cuid for the family page is created in the above in the creation query
        await Promise.all(
          Images.map(async (image: Image) => 
            await event.context.client.image.update({
              where: {
                cuid: image.cuid
              },
              data:{
                pageCuid: queryRes.cuid
              }
            })
          ))
    
        return true
    } catch(e) {
      console.error(e);
      return false
    }
  } else {
    return await sendRedirect(event, loginRedirectUrl());
  }
});


