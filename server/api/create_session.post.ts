import { PrismaClient } from "@prisma/client"
import  { nanoid } from "nanoid"
const prisma = new PrismaClient()
// Stripe API tokens
//import { loadStripe } from '@stripe/stripe-js'
import Stripe from "stripe"

const runtime = useRuntimeConfig()
 
//const stripe = require('stripe')(stripeSecretKey)


/*
*	/Page/cuid
*	function:	POST
*	submit donation details to the database and creates a stripe session
*/
export default defineEventHandler(async event => {
    const transaction_id = nanoid();
    const stripe = new Stripe(runtime.STRIPE_SECRET, { apiVersion:"2022-11-15"})
    const body = await readBody(event)
    const family_cuid = body.family_cuid
    const page_cuid = body.pageCuid
    const donorComments = body.comments;
    const state = {}; 
    const userCuid = body.userCuid
    const familyCuid = body.familyCuid 
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
			target_user_id: userCuid,
      target_family_id: familyCuid,
			target_page_name: page?.page_name as string,
			target_page_cuid: page?.cuid as string,
      comments: donorComments,
		},
		success_url: `${runtime.BASEURL}api/complete_session?transaction=${transaction_id}`,
		cancel_url: `${runtime.BASEURL}page/${page_cuid}`,
	});

	console.log(body)

    const queryRes = await prisma.pageDonation.create({
      data: {
        transaction_id: transaction_id,
        amount: body.amount_raised,
        donorFirstName: body.donorFirstName,
        donorLastName: body.donorLastName,
        comments: donorComments, 
        Family: {
          connect: {
            cuid: familyCuid
          }
        },
        User: {
          connect: {
            cuid: userCuid
          }
        },
        Page: {
          connect: {
            cuid: page_cuid,
          }
        }
    }})

    return session.url;
  }catch(e) {
    console.error(e);
  }

    
});