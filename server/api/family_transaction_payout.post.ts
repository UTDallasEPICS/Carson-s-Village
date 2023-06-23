import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import { nanoid } from "nanoid"
import Stripe from "stripe"
const stripeSecretKey = process.env.STRIPE_SECRET;
export default defineEventHandler(async event => {
      const stripe = new Stripe(stripeSecretKey as string, { apiVersion:"2022-11-15"} )
      //const stripe = await loadStripe(process.env.STRIPE_PUBLIC ? process.env.STRIPE_PUBLIC : '');
        //const query = await getQuery(event)
        const body = await readBody(event)
        body.amount_to_record = Math.trunc(body.amount_to_record * 100)
        //console.log(body)
        try{

          // update success flag in transaction
        
          await prisma.$transaction([
            prisma.donationPayout.create({
              data: {
                transaction_id: body.transaction_id,
                amount: body.amount_to_record, 
                distributionDate: body.transaction_recording_date,
                User: {
                  connect: {
                    cuid: body.familyCuid
                  }
                },
                Page: {
                  connect: {
                    cuid: body.cuid,
                  }
                }
            }}),
            prisma.page.update({
              where: {
                cuid: body.cuid as string
              },
              data: {amount_distributed: {increment: body.amount_to_record}}
            })
          ]) 
          
          return true;

        } catch (e) {
          console.error(e)
    
          }
    
    });
    
    
    
    

