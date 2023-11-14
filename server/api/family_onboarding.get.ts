import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";
import { getQuery } from 'h3';
import { useRuntimeConfig } from '#imports';

const prisma = new PrismaClient();
const runtime = useRuntimeConfig();
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe(stripeSecretKey, { apiVersion: "2022-11-15" });

export default defineEventHandler(async (event) => {
  const { familyCuid } = await getQuery(event);

  if (!familyCuid) {
    // Family CUID not provided error handling
    // return createErrorResponse(event, 'Family CUID is required');
    // Uncomment above line to enable error handling
  }

  const family = await prisma.family.findUnique({
    where: { cuid: familyCuid },
    select: { Stripe_Account_id: true },
  });

  if (!family || !family.Stripe_Account_id) {
    const newStripeAccount = await stripe.accounts.create({
      type: 'standard',
      email: event.context.user.email, // Ensure the user's email is available in the context
    });

    await prisma.family.update({
      where: { cuid: familyCuid },
      data: { Stripe_Account_id: newStripeAccount.id }
    });

    const accountLink = await stripe.accountLinks.create({
      account: newStripeAccount.id,
      refresh_url: `${runtime.public.BASE_URL}/api/family_onboarding.get?familyCuid=${familyCuid}`,
      return_url: `${runtime.public.BASE_URL}/`,
      type: 'account_onboarding',
    });

    return createRedirectResponse(event, accountLink.url);
  } else {
    // If the family already has a Stripe account, redirect to the home page
    return createRedirectResponse(event, `${runtime.public.BASE_URL}/`);
  }
});

// Commented out the error response function
// function createErrorResponse(event, message) {
//   event.res.statusCode = 400;
//   return { error: message };
// }

function createRedirectResponse(event, location) {
  event.res.writeHead(302, { Location: location });
  event.res.end();
}