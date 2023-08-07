import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import {loginRedirectUrl} from "../api/auth0"
import { nanoid } from "nanoid"
import Stripe from "stripe"
const runtime = useRuntimeConfig()

const stripeSecretKey = runtime.STRIPE_SECRET;
export default defineEventHandler(async event => {
      const stripe = new Stripe(stripeSecretKey as string, { apiVersion:"2022-11-15"} )
      //const stripe = await loadStripe(runtime.STRIPE_PUBLIC ? runtime.STRIPE_PUBLIC : '');
        //const query = await getQuery(event)
        const body = await readBody(event)
        body.amount_to_record = Math.trunc(body.amount_to_record * 100)
        //console.log(body)
        if(event.context.user?.user_role == "advocate"){
        try{

          // update success flag in transaction
          //if(event.context.user.user_role === "advocate"){
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
        //}
        //  return false
        } catch (e) {
          console.error(e)
    
          }
        } else{
          return await sendRedirect(event, loginRedirectUrl());
        }
    });
    
    
    
    

