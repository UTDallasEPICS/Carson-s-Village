import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import {loginRedirectUrl} from "../api/auth0"
import { nanoid } from "nanoid"
import Stripe from "stripe"
const runtime = useRuntimeConfig()

const stripeSecretKey = runtime.STRIPE_SECRET;
export default defineEventHandler(async event => {
      const stripe = new Stripe(stripeSecretKey as string, { apiVersion:"2022-11-15"} )
        const body = await readBody(event)
        const familiesCuid = body.familiesCuid
        try{
          if(event.context.user?.user_role == "admin" || event.context.user?.user_role == "advocate"){ //to do: remove advoate
          // update success flag in transaction
          
            /*const family = await prisma.family.findFirst({
              where: {
                  cuid: familiesCuid
              }
          })*/
          /*var familyExists = false;
          var balencePositive = false;
          familyExists = true; 
          balencePositive = true;
          if(!familyExists || !balencePositive ) {
              return '0'
          }*/
          /*const transfer = await stripe.transfers.create({
              amount: body.amount,
              currency: 'USD',
              destination: body.connected_account_id,
              // maybe add a transfer group
          })*/
          
            await prisma.$transaction([
              prisma.donationPayout.create({
                data: {
                  transaction_id: body.transaction_id,
                  amount: body.amount, 
                  distributionDate: body.distributionDate,
                  User: {
                    connect: {
                      cuid: body.userCuid
                    }
                  },
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
              prisma.page.update({
                where: {
                  cuid: body.pageCuid as string
                },
                data: {amount_distributed: {increment: body.amount}}
              })
            ]) 
            
            return true;
          }
            return await sendRedirect(event, loginRedirectUrl());
        } catch (e) {
          console.error(e)
          return false;
          }
    });
    
    
    
    

