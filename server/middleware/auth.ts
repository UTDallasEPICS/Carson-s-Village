import Stripe from "stripe"
const runtime = useRuntimeConfig()

const stripeSecretKey = runtime.STRIPE_SECRET;
import type { User, Family} from "@/types.d.ts"

export default defineEventHandler(async event => {
  //REMOVE
  return;
  //REMOVE
  
  const method = getMethod(event);
  if (method == "POST") {
    const rawBody = await readRawBody(event, false);  // Attach rawbody so stripe webhook authentication works
    event.context.rawBody = rawBody;
  }

  // Define routes excluded from middleware
  const excludedRoutes = [ '/api/stripe/webhooks' ];
  const isExcluded = excludedRoutes.some((route) => 
    event.path.startsWith(route)
  );
  if (isExcluded) {
    return;
  }

  const stripe = new Stripe(runtime.STRIPE_SECRET)

  // Stripe account creation logic Refactor after better-auth works
  /*
  try {
    if(event.context.user?.Family?.stripe_account_id == undefined && process.env.NODE_ENV == "production") {
      // todo: fill with useable address type done
      //todo: add support_address
      // we can prefil some customer stuff with salesforce one day
      const newStripeAccount = await stripe.accounts.create({
          capabilities: {
            card_payments: { requested: true },
            us_bank_account_ach_payments: { requested: true },
            amazon_pay_payments: { requested: true },
            revolut_pay_payments: { requested: true },
            klarna_payments: { requested: true },
            affirm_payments: { requested: true },
            transfers: { requests: true }
          },
          business_profile: {
            //industry: "Charities or social service organizations",
            product_description: "This is Carson's Village account used for donations on a family page",
            mcc: "8398",
            support_email: "jason@carsonsvillage.org",
            support_phone: "(877) 789-0722",
            support_url: "carsonsvillage.org",
            name: "Carson's Village",
            url: 'https://pages.carsonsvillage.org/PageList/' + event.context.user?.familyCuid,
          },
          settings: {
            payments: {
              statement_descriptor: 'Carsons Village'
            },
            card_payments: {
              statement_descriptor_prefix: 'Carsons V'
            }
          },
          type: 'express',
          email: event.context.user?.email
      });

      // Adds the stripe_account_id to the family, but the family is still suspended from creating pages and thus preventing stray donations.
      // Too extreme? Maybe we need to elaborate further to allow families to create pages that do not recieve donations.
      const transaction = await prisma?.$transaction([
        prisma?.family.update({
          where: { cuid: event.context.user?.familyCuid },
          data: { stripe_account_id: newStripeAccount.id }
      }), prisma?.page.updateMany({
        where: {
            familyCuid : event.context.user?.familyCuid as string
        },
        data: { status: 'Family Stripe Account needs onboarding'} 
        })
      ])
      const stripeAccountId = newStripeAccount.id;

      if (stripeAccountId) {
        const accountLink = await stripe.accountLinks.create({
            account: stripeAccountId,
            refresh_url: `${runtime.BASEURL}`,
            return_url: `${runtime.BASEURL}api/complete_onboarding?stripe_account_id=${stripeAccountId}`,
            type: 'account_onboarding',
        });
        return await sendRedirect(event, accountLink.url);
      }
    } else if (event.context.user?.Family?.stripe_account_id == undefined && process.env.NODE_ENV != "production") {
      const newTestStripeAccount = await stripe.accounts.create({
        type: 'custom',
        country: 'US',
        email: event.context.user?.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: 'individual',
        individual: {
          first_name: 'Test',
          last_name: 'User',
          id_number: '000000000',
          phone: '0000000000',
          email: event.context.user?.email,
          dob: { day: 1, month: 1, year: 1902 },
          address: {
            line1: 'address_full_match',
            city: 'Anytown',
            state: 'CA',
            postal_code: '12345',
          },
        },
        external_account: 'btok_us_verified', 
        business_profile: {
          mcc: '8398',
          url: 'https://test.carsonsvillage.org',
        },
        tos_acceptance: {
          date: Math.floor(Date.now() / 1000),
          ip: '8.8.8.8', // Placeholder IP for testing
        },
      });

      await prisma?.$transaction([
        prisma.family.update({
          where: { cuid: event.context.user?.familyCuid },
          data: { stripe_account_id: newTestStripeAccount.id },
        }),
        prisma.page.updateMany({
          where: {
            familyCuid: event.context.user?.familyCuid as string,
          },
          data: { status: 'Active' },
        }),
      ]);
    }
  } catch (e) {
    console.error(e) 
    setCookie(event,'cvtoken','')
    setCookie(event,'cvuser','')

    return await sendRedirect(event, loginRedirectUrl())
  }
  */

})
