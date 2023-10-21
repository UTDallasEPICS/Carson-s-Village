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
        
        try{
          if(event.context.user?.user_role == "admin" || event.context.user?.user_role == "advocate"){ //to do: remove advoate
          // update success flag in transaction
            await prisma.$transaction([
              prisma.donationPayout.create({
                data: {
                  transaction_id: body.transaction_id,
                  amount: body.amount, 
                  distributionDate: body.distributionDate,
                  User: {
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
    
    
    
    

