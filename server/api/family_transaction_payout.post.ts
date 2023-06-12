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
        try{

          // update success flag in transaction
            await prisma.page.update({
              where: {
                cuid: body.cuid as string
              },
              data: {amount_distributed: {increment: body.amount_to_record}}
            })
            const queryRes = await prisma.DonationPayout.create({
                data: {
                  transaction_id: body.transaction_id,
                  amount: body.amount_to_record, 
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
              }})
          //const pageLink = "/page/"+transaction?.pageCuid;
          return true;
          //console.log(pageLink);
          //const pageLinker = () => `${process.env.BASEURL}/page/${transaction?.pageCuid}`
          //return pageLink;
          //await sendRedirect(event, pageLinker() || "")
        } catch (e) {
          console.error(e)
    
          }
    
    });
    
    
    
    

