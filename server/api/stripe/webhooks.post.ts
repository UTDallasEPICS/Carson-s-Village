import Stripe from 'stripe';

const runtime = useRuntimeConfig()
const stripe = new Stripe(runtime.STRIPE_SECRET)

export default defineEventHandler(async (event) => {
  
  const rawBody = readRawBody(event);
  const signature = getHeader(event, 'stripe-signature')
  const stripeEvent = await getStripeEvent(rawBody, signature, stripe);
  if (!stripeEvent) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Unable to retrieve Stripe Event'
    });
  }

  if (stripeEvent.type === "charge.succeeded") {
    // Track if donation is inserted and store the cuid so it can be removed on error
    let donationCuid = null;

    try {
      // Retrieve the charge object so that payment_intent metadata and balance_transaction net_amount can be grabbed
      const charge = await stripe.charges.retrieve(
        stripeEvent.data.object.id,
        { expand: [ 'payment_intent', 'balance_transaction' ] },
        { stripeAccount: stripeEvent.account }
      );
      const metadata = charge.payment_intent.metadata;
      const netAmount = charge.balance_transaction.net;

      const donation = await prisma.pageDonation.create({
        data: {
          familyCuid: metadata.target_family_id,
          pageCuid: metadata.target_pageCuid,
          donorFirstName: metadata.donor_first_name,
          donorLastName: metadata.donor_last_name,
          donorEmail: metadata.donor_email,
          comments: metadata.comments,
          donationInitiated: new Date(Number(metadata.donation_date)),
          amount: netAmount
        }
      });
      donationCuid = donation.id;

      // Handle email newsletter subscriptions, metadata only stores strings
      if (metadata.isSubscribing === "true") {
        await subscribeToEmailList({
          email: metadata.donor_email,
          first_name: metadata.donor_first_name,
          last_name: metadata.donor_last_name
        });
      }

      // find and update page
      const page = await prisma.page.findFirst({
        where: {
          id: metadata.target_pageCuid
        }
      });
      if (!page) {
        throw Error(`Failed to retrieve page ${metadata.target_pageCuid} for update`)
      }

      // if goal_met is undefined, prisma will do nothing with it in the query
      let goal_met: Date | undefined = undefined
      if (!page.goal_met_date && page.amount_raised + netAmount >= page.donation_goal) {
        goal_met = new Date();
      }
      
      const pageUpdate = await prisma.page.update({
        where: {
          id: page.id
        },
        data: {
          amount_raised: { increment: netAmount },
          goal_met_date: goal_met,
          last_donation_date: donation.donationInitiated
        }
      });
    }
    catch (e: any) {
      console.error("Error proccessing donation charge:", e)
      
      // Delete donation in database if it exists
      if (donationCuid) {
        const deletion = await prisma.pageDonation.delete({
          where: { id: donationCuid }
        });
      }

      throw createError({
        statusCode: 500,
        statusMessage: `Error processing charge: ${e.message}`
      })
    }
  }
  else {
    console.error("Received unsupported stripe event:", stripeEvent.type);
    throw createError({
      statusCode: 403,
      statusMessage: `Event ${stripeEvent.type} not supported`
    })
  }
});

type args = {email: string, first_name: string, last_name: string};
async function subscribeToEmailList({email, first_name, last_name}: args) {
  const token = await prisma?.CC_Token.findUnique({
    where: {
      id: "0"
    }
  })

  if(email && first_name && last_name) { 
      const response = await fetch(`https://api.cc.email/v3/contacts/sign_up_form`, {
        method: 'POST',
        body: JSON.stringify({
            "email_address": email,
            "first_name": first_name,
            "last_name": last_name,
            "list_memberships": [
                `${runtime.CONSTANT_CONTACTS_LIST_MEMBERSHIP}`
            ]
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token.token}`
        },
    })

    const respBody = await response.json()
    return response.status === 200 
  }

  return false
}
