import { PrismaClient } from "@prisma/client"
import  { nanoid } from "nanoid"
const prisma = new PrismaClient()
// Stripe API tokens
const stripeSecretKey = process.env.STRIPE_SECRET;
//import { loadStripe } from '@stripe/stripe-js'
import Stripe from "stripe"

 
//const stripe = require('stripe')(stripeSecretKey)


/*
*	/Page/cuid
*	function:	POST
*	submit donation details to the database and creates a stripe session
*/

export default defineEventHandler(async event => {
    const transaction_id = nanoid();
    const { req, res } = event;
    //const stripe = await loadStripe(process.env.STRIPE_PUBLIC ? process.env.STRIPE_PUBLIC : '');
    const stripe = new Stripe(stripeSecretKey as string, { apiVersion:"2022-11-15"})
    const body = await readBody(event)
    const family_cuid = body.family_cuid
    const page_cuid = body.cuid
    //const price_in_cents = Math.round(body.amount_raised * 100)
    const state = {}; 
    //const transaction_id = () => { const s = nanoid(); state[s] = 1;  return s}
   // transaction_id = nanoid();
    
  
  
  //setCookie(event, 'cvuser',(JSON.stringify(body)))
  try{
    const page = await prisma.page.findFirst({
      where: {
        cuid: page_cuid
      }
    })
    
	const session = await stripe.checkout.sessions.create({
		mode: 'payment',
		line_items: [
			{
				price_data: {
					currency: 'usd',
					unit_amount: body.amount_raised,
					product_data: {
						name: `Donation to ${page?.page_name}`,
					},
				},
				quantity: 1
			},
		],
		metadata: {
			transaction_id: transaction_id,
			amount: body.amount_raised,
			target_family_id: family_cuid,
			target_page_name: page?.page_name as string,
			target_page_cuid: page?.cuid as string,
		},
		success_url: `${process.env.BASEURL}/api/complete_session?transaction=${transaction_id}`,
		cancel_url: `${process.env.BASEURL}/page/${page_cuid}`,
	});
	
    const queryRes = await prisma.pageDonation.create({
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
            cuid: page_cuid,
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
    console.log(session.url);
    console.log(queryRes.transaction_id);
    //await sendRedirect(event, session.url || "", 302)
    
    return session.url;
  }catch(e) {
    console.error(e);
  }

    
});