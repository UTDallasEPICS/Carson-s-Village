import {loginRedirectUrl} from "../api/auth0"
import jwt from "jsonwebtoken"
import fs from "fs"
import { PrismaClient } from "@prisma/client"
const client = new PrismaClient()
export default defineEventHandler(async event => {
  
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
        event.context.client = client
        event.context.claims = claims
        // including pages cuids to check if that's the family's page. 
        event.context.user = await event.context.client.user.findFirst(
        { where:
          { email: claims.email },
          include: {
            Pages: {
              select: {
                cuid: true
              }
            }
          }
        })
        if(event.context.user){
        setCookie(event, "cvuser", JSON.stringify(event.context.user))
        }
        } catch (e) {
        console.error(e)
        //setCookie(event,'cvtoken','')
        //setCookie(event,'cvuser','')
    
        return await sendRedirect(event, loginRedirectUrl())
      }
    }
  }
})