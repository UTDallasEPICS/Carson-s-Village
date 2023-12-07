import {loginRedirectUrl, logoutRedirectUrl} from "../api/auth0"
import jwt from "jsonwebtoken"
import fs from "fs"
import Stripe from "stripe"
const runtime = useRuntimeConfig()

const stripeSecretKey = runtime.STRIPE_SECRET;
import { PrismaClient } from "@prisma/client"
const client = new PrismaClient()
export default defineEventHandler(async event => {
  const stripe = new Stripe(runtime.STRIPE_SECRET, { apiVersion:"2022-11-15"})
  event.context.client = client
  const cvtoken = getCookie(event, "cvtoken") || ""
  // not logged in but trying to
  if (!cvtoken && !(event.node.req.url?.includes('/api/callback') || event.node.req.url?.includes("/Page/") || event.node.req.url?.includes("/api/page") || event.node.req.url?.includes("/"))) {
    await sendRedirect(event, loginRedirectUrl());
  } else {
    if (cvtoken) {
      try {
        const publicKey = fs.readFileSync(process.cwd() + "/cert-dev.pem", 'utf8');
        const claims = jwt.verify(cvtoken, publicKey);
        const user = await prisma.user.findUnique({
          where: { email: claims.email },
          include: {
            Pages: {
              select: {
                cuid: true
              }
            }, Family: {
              select: {
                Stripe_Account_id: true
              }
            }
          }
        });

        if (!user) {
          return createRedirectResponse(event, `${runtime.BASEURL}/login`);
        }
        if (user.user_role === 'family' && !user.Family?.Stripe_Account_id) {
          const newStripeAccount = await stripe.accounts.create({
            type: 'standard',
            email: user.email,
          });

          await prisma.family.update({
            where: { cuid: user.Family.cuid },
            data: { Stripe_Account_id: newStripeAccount.id }
          });

          const accountLink = await stripe.accountLinks.create({
            account: newStripeAccount.id,
            refresh_url: `${runtime.BASEURL}/api/family_onboarding.get?familyCuid=${user.Family.cuid}`,
            return_url: `${runtime.BASEURL}/`, // Users will be redirected here after onboarding
            type: 'account_onboarding',
          });

          return createRedirectResponse(event, accountLink.url);
        }

        // If the user has a Stripe account or is not part of a family, proceed as normal
      } catch (error) {
        console.error(error);
        return createRedirectResponse(event, `${runtime.BASEURL}/login`);
      }
    }
  } catch(e){
    console.error(e)
  }

});

function createRedirectResponse(event, location) {
  event.res.writeHead(302, { Location: location });
  event.res.end();
}
