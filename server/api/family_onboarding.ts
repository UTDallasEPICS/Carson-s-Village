import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

const prisma = new PrismaClient();
const runtime = useRuntimeConfig();
const stripeSecretKey = runtime.STRIPE_SECRET;
const stripe = new Stripe(stripeSecretKey as string, { apiVersion: "2022-11-15" });

// check if the family (people who needs funding )  has a stripe account
// if they dont then onboard
// within onboarding possibly look into adding more feilds 


export default defineEventHandler(async event => {
    const body = await readBody(event);

    try {
        // Check if the family is logged in and has a role of "family".
        if (event.context.user?.user_role == "family") {
            
            // Check if family already has a connected Stripe account.
            const family = await prisma.family.findUnique({
                where: {
                    cuid: body.familyCuid,
                },
                select: {
                    Stripe_Account: true,
                },
            });

            if (family && family.Stripe_Account && family.Stripe_Account.accountId) {
                // Family already onboarded with Stripe.
                return { success: true, message: "Already onboarded with Stripe." };
            } else {
                
                // Handle family's personal information
                const familyData = {
                    dateOfBirth: body.dateOfBirth,
                    countryOfResidence: body.countryOfResidence,
                    familyRelationship: body.familyRelationship,
                    familyRole: body.familyRole
                };

                await prisma.family.update({
                    where: { cuid: body.familyCuid },
                    data: familyData
                });

                // Handle individual family members' information
                const userData = {
                    email: body.userEmail,
                    first_name: body.userFirstName,
                    middle_name: body.userMiddleName,
                    last_name
                    : body.userLastName,
                    phone: body.userPhone
                };

                const user = await prisma.users.create({
                    data: userData
                });

                await prisma.family.update({
                    where: { cuid: body.familyCuid },
                    data: {
                        family_members: {
                            connect: { email: user.email }
                        }
                    }
                });

                // Create an onboarding link for the family to connect to Stripe.
                const accountLink = await stripe.accountLinks.create({
                    account: family?.Stripe_Account?.accountId || "replace_with_default_account", 
                    refresh_url: 'https://website.com/reauth', 
                    return_url: 'https://website.com/return', // need to find
                    type: 'account_onboarding',
                });

                // Redirect to Stripe's onboarding page.
                return await sendRedirect(event, accountLink.url);
            }
        } else {
            // User not logged in or doesn't have the correct role.
            return await sendRedirect(event, loginRedirectUrl());
        }
    } catch (e) {
        console.error(e);
        return { success: false, message: "Error during onboarding." };
    }
});
