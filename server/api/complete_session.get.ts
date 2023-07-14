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
  //const stripe = await loadStripe(runtime.STRIPE_PUBLIC ? runtime.STRIPE_PUBLIC : '');
    const query = await getQuery(event)
    console.log(query)
    try{
      // get amount donated from transaction
      const transaction = await prisma.pageDonation.findFirst({
        where: { transaction_id: query.transaction as string},
        include: {
          Page: {
            select: {
              page_name: true
            }
          }
        }
      })

      // TODO: reject if the transactionid has already been completed
      // update success flag in transaction
      const checkTransaction = await prisma.pageDonation.findFirst({
        where: { transaction_id: query.transaction as string}
      })

      if(checkTransaction?.success!= true){
        await prisma.$transaction([
          prisma.pageDonation.update({
            where: { transaction_id: query.transaction as string},
            data: { success: true }
          }),
          prisma.page.update({
            where: {
              cuid: transaction?.pageCuid
            },
            data: {amount_raised: {increment: transaction?.amount}}
          }),
        ])
      } else {
        console.log("Transaction already completed.")
      }

      const pageLink = "/Page/"+transaction?.pageCuid;
      //console.log(pageLink)
      await sendRedirect(event, pageLink)
      return true;
      //console.log(pageLink);
      //const pageLinker = () => `${runtime.BASEURL}/page/${transaction?.pageCuid}`
      //return pageLink;
      
    } catch (e) {
      console.error(e)

      }

});



