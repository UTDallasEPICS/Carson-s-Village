import Stripe from 'stripe';

const runtime = useRuntimeConfig()
const stripe = new Stripe(runtime.STRIPE_SECRET)

export default defineEventHandler(async (event) => {
  const prisma = event.context.client;

  const stripeEvent = await getStripeEvent(event, stripe);
  if (!stripeEvent) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Unable to retrieve Stripe Event'
    });
  }

  // Handle the specific event
  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata
    
    // Ensure that checkout has not already been handled
    const donationCheck = await prisma.pageDonation.findFirst({
      where: { checkoutId: session.id }
    })
    if (donationCheck) {
      return { received: true };
    }

    // Handle email list subscribing
    if (metadata.isSubscribing === "true" ) {
      const subscribed = subscribeToEmailList(session.customer_email, metadata.target_first_name, metadata.target_last_name);
      if (subscribed) {
        console.log(`${session.customer_email} successfully subscribed to email list`);
      } else {
        console.error(`Error subscribing ${session.customer_email} to email list`);
      }
    }
    
    try {
      const page = await prisma.page.findFirst({
        where: { cuid: metadata.target_page_cuid }
      });

      let donation_status = 'in Progress';
      
      if(page.deadline && new Date().getTime() > (page.deadline as Date).getTime() && page.donation_status == "In progress") {
        donation_status = "Failed"
      }

      // Calculate duration if needed
      const startDate = new Date(page.start_date);
      let duration: number | string = Math.round((new Date().getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + " days";
      if(duration == "1 days") {
        duration = "1 day"
      }
      if(page.donation_status == "Successful") {
        duration = page.duration
      }

      await prisma.$transaction([
        prisma.pageDonation.create({
          data: {
            familyCuid: metadata.target_family_id,
            pageCuid: metadata.target_page_cuid,
            donorFirstName: metadata.donor_first_name,
            donorLastName: metadata.donor_last_name,
            donorEmail: metadata.isSubscribing === "true" ? session.customer_emamil : "",
            comments: metadata.comments,
            isAnonymous: metadata.isAnonymous === "true",
            status: "SUCCESS",
            checkoutId: session.id,
            paymentId: session.payment_intent,
            amount: session.amount_total
          }
        }),
        prisma.page.update({
          where: { cuid: metadata.target_page_cuid },
          data: {
            last_donation_date: new Date(),
            donation_status: donation_status,
            duration: duration + ""
          }
        })
      ]);

    } catch (err: any) {
      console.error('Error occured updating database:', err)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update database'
      });
    }

    // This is what webhooks expect for a successful request
    return { received: true };
  }
  else if (stripeEvent.type === 'payment_intent.succeeded') {
    const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent;
    const fullIntent = await stripe.paymentIntents.retrieve(
      paymentIntent.id,
      {
        expand: [ 'latest_charge.balance_transaction' ]
      }
    );

    const charge = fullIntent.latest_charge as Stripe.Charge;
    const balanceTransaction = charge.balance_transaction as Stripe.BalanceTransaction;

    // we fetch the transaction to see when it's actually available.
    if (charge.status === 'succeeded' && charge.captured) {
      try {
        const donation = await prisma.pageDonation.findFirst({
          where: { paymentId: paymentIntent.id },
          include: {
            Page: true
          }
        });
        if (!donation) {
          throw new Error("Failed to fetch Donation record");
        }
        // Ensure that donation has not already been handled
        else if (donation.availableOn) {
          return { received: true };
        }

        // Update goal met if it has been met
        let goalMet = null;
        let donationStatus = "in progress";
        const newAmountRaised = donation.Page?.amount_raised + balanceTransaction.net;
        if (newAmountRaised >= donation.Page?.donation_goal) {
          goalMet = new Date();
          donationStatus = "Successful"; 
        }

        await prisma.$transaction([
          prisma.pageDonation.update({
            where: { cuid: donation.cuid },
            data: {
              fee: balanceTransaction.fee,
              net: balanceTransaction.net,            
              availableOn: new Date(balanceTransaction.available_on * 1000)
            }
          }),
          prisma.page.update({
            where: { cuid: donation.Page?.cuid },
            data: {
              amount_raised: newAmountRaised,
              goal_met_date: goalMet,
              donation_status: donationStatus
            }
          })
        ]);
      } catch (e: any) {
        console.error("Error occured in the payment database update:", e)
        throw createError({
          statusCode: 500,
          statusMessage: 'Error occured in the payment database update'
        })
      }
    } else {
      console.error('Charge has not yet succeeded or has not been captured')
      throw createError({
        statusCode: 400,
        statusMessage: 'Charge has not yet succeeded or has not been captured'
      });
    }

    // This is what webhooks expect for a successful request
    return { received: true };

  }
  console.error("Unknown error occurred when handling stripe event:", stripeEvent.type);
  throw createError({
    statusCode: 500,
    statusMessage: `Unknown error occurred when handling stripe event: ${stripeEvent.type}`
  })


});

async function subscribeToEmailList(email: string, first_name: string, last_name: string) {
  const token = await prisma?.CC_Token.findUnique({
    where: {
        cuid: "0"
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
