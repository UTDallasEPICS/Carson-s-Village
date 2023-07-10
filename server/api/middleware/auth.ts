import {loginRedirectUrl} from "../auth0"
import jwt from "jsonwebtoken"
import fs from "fs"
import { PrismaClient } from "@prisma/client"

const client = new PrismaClient()
export default defineEventHandler(async event => {
  const cvtoken = getCookie(event, "cvtoken") || ""
  // not logged in but trying to
  //if (!cvtoken && !event.reg.url.includes('/api/callback')) {
   // await sendRedirect(event, loginRedirectUrl());
  //} else {
    // theoretically logged in
    if (cvtoken) {
      //try {
        const claims = jwt.verify(
          cvtoken, 
          fs.readFileSync(process.cwd()+"/cert-dev.pem")
        )
        console.log(claims)
        event.context.claims = claims
        event.context.client = client
        
        event.context.user = await event.context.client.user.findFirst({where:{ email: claims.email }})
        console.log(event)
        await sendRedirect(event, '/')
        //setCookie(event, "user", JSON.stringify(event.context.user))
      //} catch (e) {
        //console.error(e)
       // return await sendRedirect(event, 'loginRedirectUrl()');
      //}
    //}
  }
})