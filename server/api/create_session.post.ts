
import { PrismaClient } from "@prisma/client"
import {nanoid} from "nanoid"
const prisma = new PrismaClient()
// Stripe API tokens
const stripeSecretKey = process.env.STRIPE_SECRET;
//import { loadStripe } from '@stripe/stripe-js'
import Stripe from "stripe"
const transaction_id = nanoid();
 
//const stripe = require('stripe')(stripeSecretKey)


export default defineEventHandler(async event => {
    const { req, res } = event;
    //const stripe = await loadStripe(process.env.STRIPE_PUBLIC ? process.env.STRIPE_PUBLIC : '');
    const stripe = new Stripe(stripeSecretKey as string,{ apiVersion:"2022-11-15"})
    const body = await readBody(event)
    const family_cuid = body.family_cuid
    const cuid = body.cuid
    const price_in_cents = Math.round(body.amount_raised * 100)
    const state = {}; 
    //const transaction_id = () => { const s = nanoid(); state[s] = 1;  return s}
   // transaction_id = nanoid();
    
  
  
  //setCookie(event, 'cvuser',(JSON.stringify(body)))
  try{
    const page = await prisma.page.findFirst({
      where: {
        cuid,
        User: {
          cuid: family_cuid
        }
      }
    })
    
	const session = await stripe.checkout.sessions.create({
		mode: 'payment',
		line_items: [
			{
				price_data: {
					currency: 'usd',
					unit_amount: price_in_cents,
					product_data: {
						name: `Donation to ${page?.page_name}`,
					},
				},
				quantity: 1
			},
		],
		metadata: {
			transaction_id: transaction_id,
			amount: price_in_cents,
			target_family_id: family_cuid,
			target_page_name: page?.page_name as string,
			target_page_cuid: page?.cuid as string,
		},
		success_url: `${process.env.BASEURL}/pageDonation/${cuid}/${transaction_id}`,
		cancel_url: `${process.env.BASEURL}/page/${cuid}`,
	});
	
    await prisma.pageDonation.create({
      data: {
        transaction_id: transaction_id,
        amount: body.amount_raised, 
        User: {
          connect: {
            cuid: family_cuid
          }
        },
        Page: {
          connect: {
            cuid: cuid,
          }
        }
    }})

    //res.setHeader('Access-Control-Allow-Origin', session.url);
    //await res.setResponseHeader("Access-Control-Allow-Origin", session.url);
   /* await handleCors(event,  {
      origin: "*",
      methods: "*",
      allowHeaders: [session.url]
    })*/
    
    await sendRedirect( event, session.url || "", 302)
  }catch(error) {
    console.log(error);
  }

    return true;
});