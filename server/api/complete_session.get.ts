import { PrismaClient } from "@prisma/client"
import { nanoid } from "nanoid"
const prisma = new PrismaClient()
import Stripe from "stripe"
const runtime = useRuntimeConfig()
//require('dotenv').config()
// Stripe API tokens
const stripeSecretKey = runtime.STRIPE_SECRET;

/*
*	/Page/cuid
*	function:	GET
*	updates transactions to have success tag and increments the amount donated to families
*/

export default defineEventHandler(async event => {
  const stripe = new Stripe(stripeSecretKey as string, { apiVersion:"2022-11-15"} )
    const query = getQuery(event)
    try{
      // get amount donated from transaction
      const transaction = await prisma.pageDonation.findFirst({
        where: { transaction_id: query.transaction as string},
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

      // rejects if the transactionid has already been completed
      // update success flag in transaction
      const checkTransaction = await prisma.pageDonation.findFirst({
        where: { transaction_id: query.transaction as string}
      })

      if(checkTransaction?.success!= true){
        if (transaction?.Page) {
          const newAmountRaised = transaction.Page.amount_raised + transaction.amount;
          let donation_status = 'In Progress';
          let goal_met_date = transaction.Page.goal_met_date; 
    
          if (newAmountRaised >= transaction.Page.donation_goal) {
            donation_status = 'Successful';
            if(goal_met_date == "")
              goal_met_date = new Date().toString(); 
          }
          
          if(new Date().getTime() > new Date(transaction.Page.deadline).getTime() && transaction.Page.donation_status == "in progress") {
            donation_status = "Failed"
          }
          // Calculate duration if needed
          const startDate = new Date(transaction.Page.start_date);
          let duration: number | string = Math.round((new Date().getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + " days";
          if( duration == "1 days") {
            duration = "1 day"
          }
          if(transaction.Page.donation_status == "Successful") {
            duration = transaction.Page.duration
          }
          console.log(duration)
          
        await prisma.$transaction([
          prisma.pageDonation.update({
            where: { transaction_id: query.transaction as string},
            data: { success: true }
          }),
           prisma.page.update({
            where: { cuid: transaction?.pageCuid },
            data: {
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

      const pageLink = "/Page/"+transaction?.pageCuid;
      await sendRedirect(event, pageLink)
      return true;
    } catch (e) {
      console.error(e)

      }

});



