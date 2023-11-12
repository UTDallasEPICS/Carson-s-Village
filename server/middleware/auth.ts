import {loginRedirectUrl} from "../api/auth0"
import jwt from "jsonwebtoken"
import fs from "fs"
import { PrismaClient } from "@prisma/client"
const client = new PrismaClient()

export default defineEventHandler(async event => {
  event.context.client = client
  const cvtoken = getCookie(event, "cvtoken") || ""
  
  if (!cvtoken && !(event.node.req.url?.includes('/api/callback') || event.node.req.url?.includes("/Page/") || event.node.req.url?.includes("/api/page") || event.node.req.url?.includes("/"))) {
    await sendRedirect(event, loginRedirectUrl());
  } else {
    if (cvtoken) {
      try {
        const claims = jwt.verify(
          cvtoken, 
          fs.readFileSync(process.cwd()+"/cert-dev.pem")
        )
        event.context.claims = claims
        event.context.user = await event.context.client.user.findFirst({
          where:{ email: claims.email },
          include: {
            Pages: true,
            Family: {
              select: {
                Stripe_Account_id: true,
              }
            }
          }
        })
        if (!event.context.user) {
          console.error(`${claims.email} not found`) 
          setCookie(event,'cvtoken','')
          setCookie(event,'cvuser','')
          return await sendRedirect(event, loginRedirectUrl());
        }
        
        if (event.context.user.user_role === 'family' && !event.context.user.Family?.Stripe_Account_id) {
          const redirectUrl = `${runtime.BASEURL}api/family_onboarding?familyCuid=${event.context.user.Family?.cuid}`;
          return await sendRedirect(event, redirectUrl);
        }

        setCookie(event, "cvuser", JSON.stringify(event.context.user))
      } catch (e) {
        console.error(e) 
        setCookie(event,'cvtoken','')
        setCookie(event,'cvuser','')
        return await sendRedirect(event, loginRedirectUrl())
      }
    }
  }
})
