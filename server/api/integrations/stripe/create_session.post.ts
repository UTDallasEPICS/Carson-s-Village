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
    const page_cuid = body.pageCuid
    const donorComments = body.comments;
    const state = {}; 
    const userCuid = body.userCuid
    const familyCuid = body.familyCuid 

    // Only flag subscribing if valid email and subscribed option TRUE
    const isSubscribing = isEmail(body.donorEmail) && body.subscribed;

    try {
      const page = await event.context.client.page.findFirst({
        where: {
          cuid: page_cuid
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
            unit_amount: Math.trunc(parseFloat(body.amount as unknown as string) * 100) as number,
            product_data: {
              name: `Donation to ${page?.page_first_name} ${page?.page_last_name}`,
            },  
          },
          quantity: 1
        },
      ],
      metadata: {
        target_family_id: familyCuid,
        target_page_cuid: page?.cuid as string,
        donor_first_name: body.donorFirstName,
        donor_last_name: body.donorLastName,
        isSubscribing: isSubscribing as string,
        isAnonymous: body.isAnonymous as string,
        comments: donorComments,
      },
      success_url: `${runtime.BASEURL}Page/${page_cuid}`,
      cancel_url: `${runtime.BASEURL}Page/${page_cuid}`
    });

    return session.url;
  } catch(e) {
    console.error(e);
  }
 
});
