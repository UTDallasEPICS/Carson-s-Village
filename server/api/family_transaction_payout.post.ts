import {loginRedirectUrl} from "../api/auth0"
import { nanoid } from "nanoid"
import Stripe from "stripe"
const runtime = useRuntimeConfig()

const stripeSecretKey = runtime.STRIPE_SECRET;
export default defineEventHandler(async event => {
      const stripe = new Stripe(stripeSecretKey as string, { apiVersion:"2022-11-15"} )
        const body = await readBody(event)
        const familyCuid = body.familyCuid
        if(event.context.user?.user_role == "admin") { 
          // update success flag in transaction
          
          const family = await event.context.client.family.findFirst({
              where: {
                  cuid: familyCuid
              }
          })

          const balance = (await stripe.balance.retrieve()).available[0]?.amount as unknown as number
          // Makes sure that the family has a connected account and that the main stripe account has enough money to distribute the amount in the body.
          if(family?.stripe_account_id == undefined) {
            createError({
              statusCode: 400,
              statusMessage: "Error: No Family Stripe Account Found"
            })
          }

          if(balance < body.amount) {
            //console.log(balance)
            createError({
              statusCode: 400,
              statusMessage: "Stripe Account Balance too low"
            })
          }

          const transfer = await stripe.transfers.create({
              amount: body.amount,
              currency: 'USD',
              destination: family?.stripe_account_id as string
          })

          const transferBalanceTransaction = await stripe.balanceTransactions.retrieve
          (
            transfer.balance_transaction as string,
          );
          console.log(transferBalanceTransaction.fee_details)
            await event.context.client.$transaction([
              event.context.client.donationPayout.create({
                data: {
                  transaction_id: transfer.id,
                  amount: body.amount, 
                  distributionDate: body.distributionDate,
                  Family: {
                    connect: {
                      cuid: body.familyCuid
                    }
                  },
                  Page: {
                    connect: {
                      cuid: body.pageCuid,
                    }
                  }
              }}),
              event.context.client.page.update({
                where: {
                  cuid: body.pageCuid as string
                },
                data: {amount_distributed: {increment: body.amount}}
              })
            ]) 
            
            return true;
          }
            return await sendRedirect(event, loginRedirectUrl());
      
    });
    
    
    
    

