import type { Image } from "@/types.d.ts"
import { TEXT_LIMITS } from "#shared/utils/textLimits"
import { assertTextLimits } from "~~/server/utils/textLimits"
import { dollarsToCents } from "~~/server/utils/money"


/*
*	/EditPage/0
*	function:	POST
*	submit family page details to database
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

  // extracting family id to connect the page to the authenticated user
  const {Images, Reply, PageDonations, userCuid, familyCuid, ...data} = await readBody(event)

  if(user.role === "advocate" || user.role == 'admin'|| user.id === userCuid ) {
    assertTextLimits(data, TEXT_LIMITS.page)
    // donation_goal is optional: empty/missing/0 means no goal (progress bar hidden)
    data.donation_goal = dollarsToCents(data.donation_goal)
    data.amount_raised = dollarsToCents(data.amount_raised)
    if (data.donation_goal === 0) {
      data.goal_met_date = null
    }
    try {
      const family = await prisma.family.findFirst({
        where: {
          id: familyCuid as string
        }
      })

      data.status = family?.stripe_account_id ? 'active' : 'no family stripe account'
      // Creates a new entry in the database in the page model to a specfic user
      const queryRes = await prisma.page.create({
        data: {
          ...data, id: undefined,
          User: {
            connect: {
              id : userCuid
            }
          },
          Family: {
            connect: {
              id: familyCuid
            }
          }
        }
      });

      // Initially the images are not linked to a family page, so we add it here 
      // Reason: the cuid for the family page is created in the above in the creation query
      await Promise.all(
        Images.map(async (image: Image) => 
          await prisma.image.update({
            where: {
              id: image.id
            },
            data:{
              pageCuid: queryRes.id
            }
          })
        )
      )

      return { pageId: queryRes.id }

    } catch(e) {
      console.error(e);
      throw createError({
        statusCode: 500,
        statusMessage: 'Something went wrong',
        cause: e
      });
    }
  } else {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }
});


