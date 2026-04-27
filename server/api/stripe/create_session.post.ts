import Stripe from "stripe"
import { isEmail } from 'class-validator';

const runtime = useRuntimeConfig()

/*
*	/Page/cuid
*	function:	POST
*	submit donation details to the database and creates a stripe session
*/
export default defineEventHandler(async event => {
  const stripe = new Stripe(runtime.STRIPE_SECRET)
  const body = await readBody(event)
  const isSubscribing: boolean = isEmail(body.donorEmail) && body.subscribed;

  try {
      
    const page = await prisma.page.findFirst({
      where: {
        id: body.pageCuid
      },
      include: {
        Family: {
          select: { stripe_account_id: true }
        }
      }
    })
      
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      // Only use email if it's provided and valid
      customer_email: isEmail(body.donorEmail) ? body.donorEmail : undefined,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: body.amount,
            product_data: {
              name: `Donation to ${page?.page_first_name} ${page?.page_last_name}`,
            },
          },
          quantity: 1
        },
      ],
      metadata: {
        target_family_id: body.familyCuid,
        target_pageCuid: body.pageCuid,
        target_first_name: page?.page_first_name,
        target_last_name: page?.page_last_name,
        donor_first_name: body.donorFirstName,
        donor_last_name: body.donorLastName,
        donation_date: Date.now(),
        comments: body.comments,
        isSubscribing: isSubscribing,
      },

      // attach metadata to payment as well, and also add donor email
      payment_intent_data: {
        metadata: {
          target_family_id: body.familyCuid,
          target_pageCuid: body.pageCuid,
          target_first_name: page?.page_first_name,
          target_last_name: page?.page_last_name,
          donor_first_name: body.donorFirstName,
          donor_last_name: body.donorLastName,
          donor_email: isEmail(body.donorEmail) ? body.donorEmail : undefined,
          donation_date: Date.now(),
          comments: body.comments,
          isSubscribing: isSubscribing,
        },
      },
      success_url: `${runtime.BASEURL}Page/${body.pageCuid}`,
      cancel_url: `${runtime.BASEURL}Page/${body.pageCuid}`,
    },
    {
      stripeAccount: `${page?.Family.stripe_account_id}`
    });

    return session.url;
  } 
  catch(e) {
    console.error(e);
    throw createError({ 
      statusCode: 500,
      statusMessage: "Error occurred creating stripe checkout session"
    });
  }
 
});
