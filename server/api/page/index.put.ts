import type { Image } from "@/types.d.ts"
import { TEXT_LIMITS } from "#shared/utils/textLimits"
import { assertTextLimits } from "~~/server/utils/textLimits"
import { dollarsToCents } from "~~/server/utils/money"

/*
*	/EditPage/cuid
*	function:	PUT
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

  const { Images, Reply, PageDonations, userCuid, familyCuid, Family, ...data } = await readBody(event)

  if(user.role === "advocate" || user.role == "admin" || user.id == userCuid || user.familyId == familyCuid ) {
    delete data.Family // Not sure why this is needed to fix an error
    assertTextLimits(data, TEXT_LIMITS.page)
    try {
      // Only convert when present — archive/reactivate PUTs omit money fields.
      // Empty string / 0 means no goal. Missing fields must stay untouched.
      if (data.donation_goal !== undefined && data.donation_goal !== null) {
        data.donation_goal = dollarsToCents(data.donation_goal)
        if (data.donation_goal === 0) {
          data.goal_met_date = null
        }
      }
      if (data.amount_raised !== undefined && data.amount_raised !== null) {
        data.amount_raised = dollarsToCents(data.amount_raised)
      }
      // updates a pre-existing page
      const queryRes = await prisma.page.update({
        where: {
          id: data.id
        },
        data: {
          ...data
        }
      });

      return { pageId: queryRes.id }
    } catch (e) {
      console.error(e);
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to update page ${data.id}`
      });
    }
  } else {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      });
  }
});
