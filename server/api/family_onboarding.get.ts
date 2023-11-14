import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

const prisma = new PrismaClient();
const stripeSecretKey = process.env.STRIPE_SECRET_KEY; // env variable
const stripe = new Stripe(stripeSecretKey, { apiVersion: "2022-11-15" });

export default defineEventHandler(async (event) => {
  const familyCuid = event.req.query.familyCuid;

  if (!familyCuid) {
    return createErrorResponse(event, 'Family CUID is required');
  }

  const family = await prisma.family.findUnique({
    where: { cuid: familyCuid },
    select: { Stripe_Account_id: true },
  });

  if (!family || !family.Stripe_Account_id) {
    const newStripeAccount = await stripe.accounts.create({
      type: 'standard',
      email: event.context.user.email, // Make sure the user's email is available in the context
    });

    await prisma.family.update({
      where: { cuid: familyCuid },
      data: { Stripe_Account_id: newStripeAccount.id }
    });

    const accountLink = await stripe.accountLinks.create({
      account: newStripeAccount.id,
      refresh_url: `${event.req.headers.host}/api/family_onboarding.get?familyCuid=${familyCuid}`,
      return_url: `${event.req.headers.host}/dashboard`, // Change to your actual 'dashboard' or 'completion' page
      type: 'account_onboarding',
    });

    return createRedirectResponse(event, accountLink.url);
  } else {
    // If the family already has a Stripe account, redirect to the dashboard or other appropriate page
    return createRedirectResponse(event, '/dashboard'); // Adjust the URL to your dashboard route
  }
});

function createErrorResponse(event, message) {
  event.res.statusCode = 400;
  return { error: message };
}

function createRedirectResponse(event, location) {
  event.res.writeHead(302, { Location: location });
  event.res.end();
}
