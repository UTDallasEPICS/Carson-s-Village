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

        // Redirect to embedded UI component for onboarding
        return createRedirectResponse(event, `${runtime.BASEURL}/stripe-onboarding?familyCuid=${user.Family.cuid}`);
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

// Additional endpoint for creating Account Session
app.post('/create-account-session', async (req, res) => {
  try {
    const { connectedAccountId } = req.body; // Replace with actual connected account ID from the client
    const accountSession = await stripe.accountSessions.create({
      account: connectedAccountId,
      components: {
        account_onboarding: {
          enabled: true
        }
      }
    });
    res.json({ client_secret: accountSession.client_secret });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});