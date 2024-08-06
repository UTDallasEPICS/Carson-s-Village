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
    const page_cuid = body._value.pageCuid
    const donorComments = body._value.comments;
    const state = {}; 
    const userCuid = body._value.userCuid
    const familyCuid = body._value.familyCuid 
    try {
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
					unit_amount: Math.trunc(parseFloat(body._value.amount as unknown as string) * 100) as number,
					product_data: {
						name: `Donation to ${page?.page_first_name} ${page?.page_last_name}`,
					},
				},
				quantity: 1
			},
		],
		metadata: {
			transaction_id: transaction_id,
			amount: Math.trunc(parseFloat(body._value.amount as unknown as string) * 100) as number,
			target_user_id: userCuid,
      target_family_id: familyCuid,
			target_first_name: page?.page_first_name as string,
      target_last_name: page?.page_last_name as string,
			target_page_cuid: page?.cuid as string,
      comments: donorComments,
		},
		success_url: `${runtime.BASEURL}api/complete_session?transaction=${transaction_id}&subscribing=${body._value.subscribed ? '1' : '0'}`,
		cancel_url: `${runtime.BASEURL}page/${page_cuid}`,
	});

	//console.log(body._value)

    const queryRes = await prisma.pageDonation.create({
      data: {
        transaction_id: transaction_id,
        amount: Math.trunc(parseFloat(body._value.amount as unknown as string) * 100) as number,
        donorFirstName: body._value.donorFirstName,
        donorLastName: body._value.donorLastName,
        donorEmail: body._value.donorEmail,
        comments: donorComments, 
        donationDate: new Date().toISOString(),
        Family: {
          connect: {
            cuid: familyCuid
          }
        },
        Page: {
          connect: {
            cuid: page_cuid,
          }
        }
    }})

    return session.url;
  } catch(e) {
    console.error(e);
  }
 
});