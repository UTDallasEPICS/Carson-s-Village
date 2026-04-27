import Stripe from "stripe"

const runtime = useRuntimeConfig()
const stripe = new Stripe(runtime.STRIPE_SECRET)

export default defineEventHandler(async event => {
  const session = await auth.api.getSession({
    headers: event.headers
  })
  if (!session || !session.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }
  const user = session.user

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id }
  });
  if (!dbUser) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unable to find user'
    });
  }

  if (user.role === "family") {

    const dbUser = await prisma.user.findUnique({
      where: {
        id: user.id 
      },
      include: {
        Family: true
      }
    });
    if (!dbUser || !dbUser.Family) {
      console.error('Unable to find user or family')
      throw createError({
        statusCode: 401,
        statusMessage: 'Unable to find user or family'
      });
    }

    try {
      // If stripe account already onboarded, then just redirect to landing page
      if (!!dbUser.Family.stripe_account_id) {
        return await sendRedirect(event, '/');
      }
      else if(dbUser.Family.stripe_account_id == undefined && process.env.NODE_ENV == "production") {
        const newStripeAccount = await stripe.accounts.create({
            capabilities: {
              card_payments: { requested: true },
              us_bank_account_ach_payments: { requested: true },
              amazon_pay_payments: { requested: true },
              klarna_payments: { requested: true },
              affirm_payments: { requested: true },
              transfers: { requested: true }
            },
            business_profile: {
              //industry: "Charities or social service organizations",
              product_description: "This is Carson's Village account used for donations on a family page",
              mcc: "8398",
              support_email: "jason@carsonsvillage.org",
              support_phone: "(877) 789-0722",
              support_url: "carsonsvillage.org",
              name: "Carson's Village",
              url: 'https://pages.carsonsvillage.org/PageList/' + user.familyId + '?fetch=family' //this sucks, route has role guards
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
            email: user.email
        });

        // Adds the stripe_account_id to the family, but the family is still suspended from creating pages and thus preventing stray donations.
        // Too extreme? Maybe we need to elaborate further to allow families to create pages that do not recieve donations.
        const transaction = await prisma?.$transaction([
          prisma?.family.update({
            where: { id: user.familyId },
            data: { stripe_account_id: newStripeAccount.id }
          }), 
          prisma?.page.updateMany({
            where: {
              familyCuid : user.familyId
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
      } 
      // Create a dummy test account on dev servers
      else if (dbUser.Family.stripe_account_id == undefined && process.env.NODE_ENV != "production") {
        const newTestStripeAccount = await stripe.accounts.create({
          type: 'custom',
          country: 'US',
          email: user.email,
          capabilities: {
            card_payments: { requested: true },
            us_bank_account_ach_payments: { requested: true },
            amazon_pay_payments: { requested: true },
            klarna_payments: { requested: true },
            affirm_payments: { requested: true },
            transfers: { requested: true }
          },
          business_type: 'individual',
          individual: {
            first_name: 'Test',
            last_name: 'User',
            id_number: '000000000',
            phone: '0000000000',
            email: user.email,
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
            where: { id: user.familyId },
            data: { stripe_account_id: newTestStripeAccount.id },
          }),
          prisma.page.updateMany({
            where: {
              familyCuid: user.familyId
            },
            data: { status: 'Active' },
          }),
        ]);
        return await sendRedirect(event, '/')
      }
    } catch (e) {
      console.error('Something went wrong in stripe account onboarding:\n', e) 
      throw createError({
        statusCode: 500,
        statusMessage: 'Something went wrong in stripe account onboarding'
      })
    }
  }
  else {
    throw createError({
      statusCode: 401,
      statusMessage: 'Only family users can have stripe accounts onboarded'
    })
  }

  throw createError({
    statusCode: 500,
    statusMessage: 'Something went wrong'
  })
});
