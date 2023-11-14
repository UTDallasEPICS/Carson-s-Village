// Import necessary modules and functions
import {loginRedirectUrl} from "../api/auth0"
import jwt from "jsonwebtoken"
import fs from "fs"
import { PrismaClient } from "@prisma/client"
import { sendRedirect } from "some-module"; // Replace with actual module that provides sendRedirect
import { getCookie, setCookie } from "some-cookie-module"; // Replace with actual module that provides cookie functions

// Initialize Prisma client
const client = new PrismaClient()

export default defineEventHandler(async event => {
  event.context.client = client
  const cvtoken = getCookie(event, "cvtoken") || ""
  
  // Redirect users who are not logged in and are not accessing public routes
  if (!cvtoken && !(event.node.req.url?.includes('/api/callback') || event.node.req.url?.includes("/Page/") || event.node.req.url?.includes("/api/page") || event.node.req.url?.includes("/"))) {
    return await sendRedirect(event, loginRedirectUrl());
  } else {
    // If there is a token, attempt to verify it and retrieve user details
    if (cvtoken) {
      try {
        const claims = jwt.verify(
          cvtoken, 
          fs.readFileSync(process.cwd()+"/cert-dev.pem")
        )
        event.context.claims = claims
        // Fetch the user from the database including related Family
        event.context.user = await event.context.client.user.findFirst({
          where:{ email: claims.email },
          include: {
            Pages: true,
            Family: true, // Include the related Family model
          }
        })
        // If no user is found, clear cookies and redirect to login
        if (!event.context.user) {
          console.error(`${claims.email} not found`) 
          setCookie(event, 'cvtoken', '')
          setCookie(event, 'cvuser', '')
          return await sendRedirect(event, loginRedirectUrl());
        }
        // If the user is a family member without a Stripe account, redirect to onboarding
        if (event.context.user.user_role === 'family' && !event.context.user.Family?.Stripe_Account_id) {
          // Construct the redirect URL for onboarding
          const redirectUrl = `/api/family_onboarding.get?familyCuid=${event.context.user.Family?.cuid}`;
          return await sendRedirect(event, redirectUrl);
        }
        // Set a cookie with the user's information
        setCookie(event, "cvuser", JSON.stringify(event.context.user))
      } catch (e) {
        console.error(e) 
        setCookie(event, 'cvtoken', '')
        setCookie(event, 'cvuser', '')
        return await sendRedirect(event, loginRedirectUrl())
      }
    }
  }
})
