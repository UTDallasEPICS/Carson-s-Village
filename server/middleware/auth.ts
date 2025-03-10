import {loginRedirectUrl, logoutRedirectUrl} from "../api/auth0"
import jwt from "jsonwebtoken"
import fs from "fs"
import Stripe from "stripe"
const runtime = useRuntimeConfig()

const stripeSecretKey = runtime.STRIPE_SECRET;
import { PrismaClient } from "@prisma/client"
import type { User, Family} from "@/types.d.ts"
const client = new PrismaClient()
export default defineEventHandler(async event => {
  const stripe = new Stripe(runtime.STRIPE_SECRET, { apiVersion:"2022-11-15"}) // todo: upgrade to "2023-10-16" version
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
        event.context.user = await event.context.client?.user.findFirst(
          {
            where: { 
              email: claims.email,
              isActive: true
                   }
          ,
          include: {
            Pages: {
              select: {
                cuid: true
              }
            }, Family: {
              select: {
                cuid: true,
                stripe_account_id: true,
                Pages: { select: {
                  cuid: true,
                  status: true
                }
              }
            }
            }
          }
          }) as unknown as Partial<User> & { Family: Partial<Family>}
        if(!event.context.user) {
          console.error(`${claims.email} not found`) 
          setCookie(event,'cvtoken','')
          setCookie(event,'cvuser','')
          return await sendRedirect(event, logoutRedirectUrl(cvtoken)) // todo: add error message after failed log in attempt
          return await sendRedirect(event, loginRedirectUrl());
        }
        // include pages ids to check if that's the family's page. 
        setCookie(event, "cvuser", JSON.stringify(event.context.user))
        
        // check if the family has a stripe account and onboarding them with stripe if not
        if (event.context.user?.user_role == "family") {
          try {
            if(event.context.user?.Family?.stripe_account_id == undefined) {
                    // todo: fill with useable address type done
                    //todo: add support_address
                         // we can prefil some customer stuff with salesforce one day
                    const newStripeAccount = await stripe.accounts.create({
                        business_profile: {
                          //industry: "Charities or social service organizations",
                          product_description: "This is Carson's Village account used for donations on a family page",
                          mcc: "8398",
                          support_email: "jason@carsonsvillage.org",
                          support_phone: "(877) 789-0722",
                          support_url: "carsonsvillage.org",
                          name: "Carson's Village",
                          url: 'https://pages.carsonsvillage.org/PageList/' + event.context.user?.familyCuid,
                          /*support_address: {
                             city : 'Dallas',
                             country : 'US',
                             line1 : '2904 Floyd Street',
                             line2 : null,
                             postal_code : 75204,
                             state: 'TX'
                          }*/
                        },
                        settings: {
                          payments: {
                            statement_descriptor: 'Carsons Village'
                          },
                          card_payments: {
                            statement_descriptor_prefix: 'Carsons V'
                          }
                        },
                        type: 'standard',
                        email: event.context.user?.email
                    });

                    // Adds the stripe_accounnt_id to the family, but the family is still suspended from creating pages and thus preventing stray donations.
                    // Too extreme? Maybe we need to elaborate further to allow families to create pages that do not recieve donations.
                    const transaction = await event.context.client?.$transaction([
                      event.context.client?.family.update({
                        where: { cuid: event.context.user?.familyCuid },
                        data: { stripe_account_id: newStripeAccount.id }
                    }), event.context.client?.page.updateMany({
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
      } else {
        const id = event.context.user?.Family?.stripe_account_id
        const stripeAccountFull = await stripe.accounts.retrieve(
          id as string)
        //console.log(stripeAccountFull)
        // if the user backed out of the onboard, they will be redirected back to the onboard
        if(!stripeAccountFull.details_submitted) {
            const accountLink = await stripe.accountLinks.create({
                account: id,
                refresh_url: `${runtime.BASEURL}`,
                return_url: `${runtime.BASEURL}api/complete_onboarding?stripe_account_id=${id}`,
                type: 'account_onboarding',
            });
            return await sendRedirect(event, accountLink.url);
        }
      }
      } catch (e: any) {
        console.error(e)
      }
    } 
  } catch(e: any){
      console.error(e.message)
      /*if(e.message.includes('jwt expired')) {
        await sendRedirect(event, logoutRedirectUrl(cvtoken))
      }*/
  }
}
}
})