import {loginRedirectUrl} from "../auth0"
import jwt from "jsonwebtoken"
import fs from "fs"
import { PrismaClient } from "@prisma/client"

const client = new PrismaClient()

export default defineEventHandler(async event => {
  const cvtoken = getCookie(event, "cvtoken") || ""
  // not logged in but trying to
  if (!cvtoken && !event.reg.url.includes('/api/authcallback')) {
    await sendRedirect(event, loginRedirectUrl());
  } else {
    // theoretically logged in
    if (cvtoken) {
      try {
        const claims = jwt.verify(
          cvtoken, 
          fs.readFileSync("./cert-dev.pem")
        )
        event.context.claims = claims
        event.context.client = client
        event.context.user = await event.context.client.user.getByEmail(claims.email)
        //setCookie(event, "user", JSON.stringify(event.context.user))
      } catch (e) {
        console.error(e)
        return await sendRedirect(event, loginRedirectUrl());
      }
    }
  }
})