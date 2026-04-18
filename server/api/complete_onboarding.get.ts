
import Stripe from "stripe"
const runtime = useRuntimeConfig()

const stripeSecretKey = runtime.STRIPE_SECRET;
// This api endpoint happens after a family member onboards to Stripe Connect.
// After the family has submitted all of their details to Stripe, their Carson's Village pages will be active.

export default defineEventHandler(async event => {
  const { user } = await auth.api.getSession({
    headers: event.headers
  })

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }

  const { stripe_account_id } = getQuery(event)
  const stripe = new Stripe(runtime.STRIPE_SECRET)
  const stripeAccountFull = await stripe.accounts.retrieve(stripe_account_id as string)
  
  // if the user backed out of the onboard, they will be redirected back to the onboard
  if(stripeAccountFull.details_submitted) {  
    const queryRes = await prisma.page.updateMany({
      where: {
        familyCuid : user.familyId as string
      },
      data: {
        status: 'active'
      } 
    })
  } else {
    await sendRedirect(event, '/')
    return false
  }
  await sendRedirect(event, '/')
  return true
  
})
