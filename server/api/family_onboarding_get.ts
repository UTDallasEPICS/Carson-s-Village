import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";
import { loginRedirectUrl } from "./auth0";

const prisma = new PrismaClient();
const runtime = useRuntimeConfig();
const stripeSecretKey = runtime.STRIPE_SECRET;
const stripe = new Stripe(stripeSecretKey as string, { apiVersion: "2022-11-15" });


export default defineEventHandler(async event => {
    // Extract the required data for onboarding from the request body
    const body = await readBody(event);

    try {
        // Ensure the user is logged in and belongs to the "family" role
        if (event.context.user?.user_role == "family") {
            
            // Retrieve the family's Stripe account details if they exist in the database
            const family = await prisma.Family.findUnique({
                where: {
                    cuid: body.familyCuid,
                },
                select: {
                    Stripe_Account_id: true,
                },
            });

            // Extract the Stripe account ID if it exists, else set to null
            let stripeAccountId: string | null = family?.Stripe_Account_id || null;

            // Create a new Stripe account if one doesn't already exist for the family
            if (!stripeAccountId) {
                const newStripeAccount = await stripe.accounts.create({
                    type: 'standard',
                    email: body.userEmail,
                });

                // Store the new Stripe account ID in the database
                await prisma.Family.update({
                    where: { cuid: body.familyCuid },
                    data: { Stripe_Account_id: newStripeAccount.id }
                });

                stripeAccountId = newStripeAccount.id;
            }

            // With a valid Stripe account ID in place, proceed to onboarding
            if (stripeAccountId) {
                // Create a new user with the provided details
                const userData = {
                    email: body.userEmail,
                    first_name: body.userFirstName,
                    middle_name: body.userMiddleName,
                    last_name: body.userLastName,
                    phone: body.userPhone
                };

                const user = await prisma.User.create({
                    data: userData
                });

                // Associate the newly created user with the family
                await prisma.Family.update({
                    where: { cuid: body.familyCuid },
                    data: {
                        family_members: {
                            connect: { email: user.email }
                        }
                    }
                });

                // Generate a Stripe onboarding link for the family
                const accountLink = await stripe.accountLinks.create({
                    account: stripeAccountId,
                    refresh_url: 'https://yourwebsite.com/reauth',
                    return_url: 'https://yourwebsite.com/return',
                    type: 'account_onboarding',
                });

                // Direct the user to the Stripe onboarding page
                return await sendRedirect(event, accountLink.url);
            } else {
                // Handle the case where no Stripe account was available or created
                return { success: false, message: "Error creating Stripe account." };
            }
        } else {
            // If the user isn't logged in or is of the wrong role, redirect to login
            return await sendRedirect(event, loginRedirectUrl());
        }
    } catch (e) {
        // Handle any exceptions that arise during the process
        console.error(e);
        return { success: false, message: "Error during onboarding." };
    }
});
