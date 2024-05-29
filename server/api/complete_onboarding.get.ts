import {loginRedirectUrl, logoutRedirectUrl} from "../api/auth0"
import Stripe from "stripe"
const runtime = useRuntimeConfig()

const stripeSecretKey = runtime.STRIPE_SECRET;
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

// This api endpoint happens after a family member onboards to Stripe Connect.
// After the family has submitted all of their details to Stripe, their Carson's Village pages will be active.

export default defineEventHandler(async event => {
  const { stripe_account_id } = getQuery(event)
  const stripe = new Stripe(runtime.STRIPE_SECRET, { apiVersion:"2022-11-15"}) // todo: upgrade to "2023-10-16" version
  const cvtoken = getCookie(event, "cvtoken") || ""

  const stripeAccountFull = await stripe.accounts.retrieve(
    stripe_account_id as string)
  console.log(stripeAccountFull)
  // if the user backed out of the onboard, they will be redirected back to the onboard
  if(stripeAccountFull.details_submitted) {  
const queryRes = await prisma.page.updateMany({
    where: {
        familyCuid : event.context.user.familyCuid as string
    },
    data: { status: 'active'} 
})
  } else {
    await sendRedirect(event, '/')
    return false
  }
   await sendRedirect(event, '/')
   return true
  
})