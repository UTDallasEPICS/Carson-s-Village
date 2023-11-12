import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";
import { loginRedirectUrl } from "./auth0";

const prisma = new PrismaClient();
const runtime = useRuntimeConfig();
const stripeSecretKey = runtime.STRIPE_SECRET;
const stripe = new Stripe(stripeSecretKey as string, { apiVersion: "2022-11-15" });

export default defineEventHandler(async event => {
    const body = await readBody(event);

    try {
        if (event.context.user?.user_role == "family") {
            const family = await prisma.family.findUnique({
                where: {
                    cuid: body.familyCuid,
                },
                select: {
                    Stripe_Account_id: true,
                },
            });

            let stripeAccountId = family?.Stripe_Account_id;

            if (!stripeAccountId) {
                const newStripeAccount = await stripe.accounts.create({
                    type: 'standard',
                    email: event.context.user.email,
                });

                await prisma.family.update({
                    where: { cuid: body.familyCuid },
                    data: { Stripe_Account_id: newStripeAccount.id }
                });

                stripeAccountId = newStripeAccount.id;
            }

            if (stripeAccountId) {
                const accountLink = await stripe.accountLinks.create({
                    account: stripeAccountId,
                    refresh_url: `${runtime.BASEURL}api/family_onboarding?familyCuid=${body.familyCuid}`,
                    return_url: `${runtime.BASEURL}api/family_dashboard?familyCuid=${body.familyCuid}`,
                    type: 'account_onboarding',
                });

                return await sendRedirect(event, accountLink.url);
            } else {
                return { success: false, message: "Error creating Stripe account." };
            }
        } else {
            return await sendRedirect(event, loginRedirectUrl());
        }
    } catch (e) {
        console.error(e);
        return { success: false, message: "Error during onboarding." };
    }
});
