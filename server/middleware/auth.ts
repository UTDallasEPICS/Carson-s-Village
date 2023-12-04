import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import { parseCookies } from 'h3';
import Stripe from 'stripe';
import { useRuntimeConfig } from '#imports';

const prisma = new PrismaClient();
const runtime = useRuntimeConfig();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });

export default defineEventHandler(async (event) => {
  const cookies = parseCookies(event);
  const cvtoken = cookies.cvtoken || '';

  if (!cvtoken && !event.req.url?.startsWith('/api/callback')) {
    return createRedirectResponse(event, `${runtime.BASEURL}/login`);
  }

  if (cvtoken) {
    try {
      const publicKey = fs.readFileSync(process.cwd() + '/cert-dev.pem', 'utf8');
      const claims = jwt.verify(cvtoken, publicKey);
      const user = await prisma.user.findUnique({
        where: { email: claims.email },
        include: { Family: true },
      });

      if (!user) {
        return createRedirectResponse(event, `${runtime.BASEURL}/login`);
      }

      if (user.user_role === 'family' && !user.Family?.Stripe_Account_id) {
        const customAccountData = {
          email: user.email,
          type: 'custom',
          business_type: 'individual',
          requested_capabilities: ['transfers'],
          // Include other necessary fields as per Stripe and Carson Village requirements for custom accounts
        };

        const newStripeAccount = await stripe.accounts.create(customAccountData);

        await prisma.family.update({
          where: { cuid: user.Family.cuid },
          data: { Stripe_Account_id: newStripeAccount.id },
        });

        const accountLink = await stripe.accountLinks.create({
          account: newStripeAccount.id,
          refresh_url: `${runtime.BASEURL}/api/family_onboarding.get?familyCuid=${user.Family.cuid}`,
          return_url: `${runtime.BASEURL}/dashboard`, // Redirect to dashboard after onboarding.
          type: 'account_onboarding',
        });

        return createRedirectResponse(event, accountLink.url);
      } else if (user.user_role === 'family' && user.Family?.Stripe_Account_id) {
        // Check the existing Stripe account for transfers capability status.
        const stripeAccount = await stripe.accounts.retrieve(user.Family.Stripe_Account_id);
        if (stripeAccount.capabilities.transfers === 'inactive') {
          const additionalInfoUrl = `${runtime.BASEURL}/additional-info?familyCuid=${user.Family.cuid}`;
          return createRedirectResponse(event, additionalInfoUrl);
        }
      }
    } catch (error) {
      console.error(error);
      return createRedirectResponse(event, `${runtime.BASEURL}/login`);
    }
  }
});

function createRedirectResponse(event, location) {
  event.res.writeHead(302, { Location: location });
  event.res.end();
}
