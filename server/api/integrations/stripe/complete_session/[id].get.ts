import { subscribe } from "diagnostics_channel";
import { nanoid } from "nanoid"
import Stripe from "stripe"
const runtime = useRuntimeConfig()
// Stripe API tokens
const stripeSecretKey = runtime.STRIPE_SECRET;

const subscribeToEmailList = async(event: any, email: string, first_name: string, last_name: string) => {
  const token = await event.context.client?.CC_Token.findUnique({
    where: {
        cuid: "0"
    }
  })

  if(email && first_name && last_name) { 
      const response = await fetch(`https://api.cc.email/v3/contacts/sign_up_form`, {
        method: 'POST',
        body: JSON.stringify({
            "email_address": email,
            "first_name": first_name,
            "last_name": last_name,
            "list_memberships": [
                `${runtime.CONSTANT_CONTACTS_LIST_MEMBERSHIP}`
            ]
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token.token}`
        },
    })

    const respBody = await response.json()
    return response.status === 200 
  }

  return false
}

/*
*	/Page/cuid
*	function:	GET
*	updates transactions to have success tag and increments the amount donated to families
*/
export default defineEventHandler(async event => {

  
  const stripe = new Stripe(stripeSecretKey as string, { apiVersion:"2022-11-15"} )
  const transaction_id = getRouterParam(event, 'id')

  const { subscribing } = getQuery(event)
    try {
      // get amount donated from transaction
      const transaction = await event.context.client.pageDonation.findFirst({
        where: { transaction_id: transaction_id as string},
        include: {
          Page: {
            select: {
              page_first_name: true,
              page_last_name: true,
              amount_raised: true,
              donation_goal: true,
              deadline: true,
              start_date: true,
              donation_status: true,
              duration: true,
              goal_met_date: true
            }
          }
        }
      })

      if(subscribing as string == '1'){
        const subscribed = await subscribeToEmailList(
            event,
            transaction?.donorEmail || "",
            transaction?.donorFirstName || "",
            transaction?.donorLastName || ""
        )
        if (subscribed) {
          console.log('Data submitted successfully.');
      } else {
          console.error('Error submitting data.');
      }
      }
      // rejects if the transactionid has already been completed
      // update success flag in transaction
      const checkTransaction = await event.context.client.pageDonation.findFirst({
        where: { transaction_id: transaction_id as string}
      })

      if(checkTransaction?.success!= true){
        if (transaction?.Page) {
          const newAmountRaised = transaction.Page.amount_raised + transaction.amount;
          let donation_status = 'in Progress';
          let goal_met_date = transaction.Page.goal_met_date; 
    
          if (newAmountRaised >= transaction.Page.donation_goal) {
            donation_status = 'Successful';
            if(goal_met_date == null)
              goal_met_date = new Date(); 
          }
          
          if(transaction.Page?.deadline && new Date().getTime() > (transaction.Page?.deadline as Date).getTime() && transaction.Page.donation_status == "In progress") {
            donation_status = "Failed"
          }
          // Calculate duration if needed
          const startDate = new Date(transaction.Page.start_date);
          let duration: number | string = Math.round((new Date().getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + " days";
          if(duration == "1 days") {
            duration = "1 day"
          }
          if(transaction.Page.donation_status == "Successful") {
            duration = transaction.Page.duration
          }
          //console.log(duration)
          
        await event.context.client.$transaction([
          event.context.client.pageDonation.update({
            where: { transaction_id: transaction_id as string},
            data: { success: true }
          }),
           event.context.client.page.update({
            where: { cuid: transaction?.pageCuid },
            data: {
              last_donation_date: new Date(),
              amount_raised: {increment: transaction?.amount},
              donation_status: donation_status,
              goal_met_date: goal_met_date,
              duration: duration + "",
            }
          })
        ])
      }
     } else {
        console.log("Transaction already completed.")
      }

      const pageLink = "/Page/"+ transaction?.pageCuid;
      await sendRedirect(event, pageLink)
      return true;
    } catch (e) {
      console.error(e)

      }

});



