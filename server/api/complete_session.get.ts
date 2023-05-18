import { PrismaClient } from "@prisma/client"
import {nanoid} from "nanoid"
const prisma = new PrismaClient()
import Stripe from "stripe"

//require('dotenv').config()
// Stripe API tokens
const stripeSecretKey = process.env.STRIPE_SECRET;


export default defineEventHandler(async event => {
  const stripe = new Stripe(stripeSecretKey as string,{ apiVersion:"2022-11-15"})
  //const stripe = await loadStripe(process.env.STRIPE_PUBLIC ? process.env.STRIPE_PUBLIC : '');
    const query = await getQuery(event)
    
    try{

    const transaction = await prisma.pageDonation.findFirst({
        where: { transaction_id: query.transaction_id as string},
        include: {
          Page: {
            select: {
              page_name: true
            }
          }
        }
      })
      // update success flag in transaction
      await prisma.$transaction([
        prisma.pageDonation.update({
          where: { transaction_id: query.transaction_id as string },
          data: {success: true}
        }),
        prisma.page.update({
          where: {
            cuid: transaction?.pageCuid
          },
          data: {amount_raised: {increment: transaction?.amount}}
        }),
      ])
  
    } catch (e) {
      console.error(e)
      }try{
      // get amount donated from transaction
      const transaction = await prisma.pageDonation.findFirst({
        where: { transaction_id: query.transaction_id as string},
        include: {
          Page: {
            select: {
              page_name: true
            }
          }
        }
      })
      // update success flag in transaction
      await prisma.$transaction([
        prisma.pageDonation.update({
          where: { transaction_id: query.transaction_id as string},
          data: {success: true}
        }),
        prisma.page.update({
          where: {
            cuid: transaction?.pageCuid
          },
          data: {amount_raised: {increment: transaction?.amount}}
        }),
      ])
      const pageLink = "/Page/"+transaction?.pageCuid;
      console.log(pageLink);
      await sendRedirect(event, pageLink)
    } catch (e) {
      console.error(e)

      }

});



