import {loginRedirectUrl} from "../api/auth0"
import jwt from "jsonwebtoken"
import fs from "fs"
import { PrismaClient } from "@prisma/client"
const client = new PrismaClient()
export default defineEventHandler(async event => {
  
  const cvtoken = getCookie(event, "cvtoken") || ""
  // not logged in but trying to
  if (!cvtoken && !(event.req.url.includes('/api/callback') || event.req.url.includes("/Page/") || event.req.url.includes("/api/page"))) {
    await sendRedirect(event, loginRedirectUrl());
  } else {
    // theoretically logged in
    if (cvtoken) {
      try {
        const claims = jwt.verify(
          cvtoken, 
          fs.readFileSync(process.cwd()+"/cert-dev.pem")
        )
        event.context.client = client
        event.context.claims = claims
        event.context.user = await event.context.client.user.findFirst({where:{ email: claims.email }})
       
        setCookie(event, "cvuser", JSON.stringify(event.context.user))
        console.log(event.context.user.user_role)
        console.log(event.node.req.url);
        if(event.context.user.user_role !=='advocate' && (event.node.req.url?.includes('/Users') || event.node.req.url?.includes('/EditUser') || event.node.req.url?.includes('/FamilyTransactionList'))){
          console.log("user not allowed")
          return await sendRedirect(event, loginRedirectUrl());
        } else if(event.context.user.user_role ==='family' && (event.node.req.url?.includes('/EditPage/') || event.node.req.url?.includes('/PageList/'))){
          if((event.node.req.url?.includes('/EditPage/') && (!(event.node.req.url?.includes('/EditPage/0'))))){

            event.context.page = await event.context.client.page.findFirst({where:{ cuid: event.node.req.url.substring(event.node.req.url?.lastIndexOf('/')+1) }})
            console.log(event.context.page)
            if(event.context.page.familyCuid !== event.context.user.cuid){
              console.log("not allowed")
              return await sendRedirect(event, loginRedirectUrl());
            }
          } else if((event.node.req.url?.includes('/PageList/') && !(event.node.req.url?.includes('/PageList/' + event.context.user.cuid)))){
            console.log("not allowed")
            return await sendRedirect(event, loginRedirectUrl());
            }

        }
        } catch (e) {
        console.error(e)
        return await sendRedirect(event, loginRedirectUrl());
      }
    }
  }
})