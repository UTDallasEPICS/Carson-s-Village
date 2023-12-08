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
    // theoretically logged in
    if (cvtoken) {
      try {
        const claims = jwt.verify(
          cvtoken, 
          fs.readFileSync(process.cwd()+"/cert-dev.pem")
        )
        event.context.claims = claims
        event.context.user = await event.context.client.user.findFirst(
          {
            where:{ email: claims.email }
          ,
          include: {
            Pages: {
              select: {
                cuid: true
              }
            }, Family: {
              select: {
                stripe_account_id: true
              }
            }
          }
          })
        if(!event.context.user) {
          console.error(`${claims.email} not found`) 
          setCookie(event,'cvtoken','')
          setCookie(event,'cvuser','')
          return await sendRedirect(event, loginRedirectUrl());
        }
        // include pages ids to check if that's the family's page. 
        setCookie(event, "cvuser", JSON.stringify(event.context.user))
        
        // check if the family has a stripe account and onboarding them with stripe if not
        if(event.context.user?.Family?.stripe_account_id == undefined ) {
          try {
            if (event.context.user?.user_role == "family") {
                    const newStripeAccount = await stripe.accounts.create({
                        type: 'standard',
                        email: event.context.user.email,
                    });

                    await event.context.client.family.update({
                        where: { cuid: event.context.user.familyCuid },
                        data: { stripe_account_id: newStripeAccount.id }
                    });
    
                    let stripeAccountId = newStripeAccount.id;
    
                if (stripeAccountId) {
                    const accountLink = await stripe.accountLinks.create({
                        account: stripeAccountId,
                        refresh_url: `${runtime.BASEURL}`,
                        return_url: `${runtime.BASEURL}`,
                        type: 'account_onboarding',
                    });
                    
            return await sendRedirect(event, accountLink.url);
        }
      }
      } catch (e) {
        console.error(e) 
        setCookie(event,'cvtoken','')
        setCookie(event,'cvuser','')
    
        return await sendRedirect(event, loginRedirectUrl())
      }
    }
  } catch(e){
    console.error(e)
  }
}
}
})