import {loginRedirectUrl} from "./auth0"
import type { Image } from "@/types.d.ts"

/*
*	/EditPage/cuid
*	function:	PUT
*	submit family page details to database
*/

export default defineEventHandler(async event => {
  const { Images, Reply, PageDonations, userCuid, familyCuid, Family, ...data } = await readBody(event)
  //const userCuid = data.userCuid
  //delete data.userCuid;
  
  if(event.context.user?.user_role === "advocate" || event.context.user?.user_role == "admin" || event.context.user?.cuid == userCuid || event.context.user?.Family?.cuid == familyCuid ) {
    console.log(data.amount_raised)
    delete data.Family // Not sure why this is needed to fix an error
    try {
      // Removes comma parses the whole decimal number and converts it to cents to be stored in DB
      if(typeof data.donation_goal == 'string') {
        data.donation_goal = Math.trunc(parseFloat(data.donation_goal.replace(",","")) * 100);
      }
      if(typeof data.amount_raised == 'string') {
        data.amount_raised = Math.trunc(parseFloat(data.amount_raised.replace(",","")) * 100);
        console.log("amount raised after removing formating ", data.amount_raised)
      }
      // updates a pre-existing page
      const queryRes = await event.context.client.page.update({
        where: {
          cuid: data.cuid
        },
        data: {
          ...data
        }
      });
    } catch (e) {
      console.error(e);
      return false
    }
    return true
} else{
  return await sendRedirect(event, loginRedirectUrl());
}
});