import jwt from "jsonwebtoken"
import fs from "fs"
import { PrismaClient } from "@prisma/client"
const client = new PrismaClient()

export default defineEventHandler(async event => {
  const body = await readBody(event)
  console.log(body)
  console.log(body.value)
  const requestURL = () => `${process.env.ISSUER}/oauth/token`
  const responseAuth0 = await fetch(requestURL(),
   { method: 'POST',
    headers: {'content-type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: process.env.AUTH0_CLIENTID as string,
    client_secret: process.env.AUTH0_SECRET as string,
    code: body.code,
    redirect_uri: process.env.BASEURL as string + '/api/callback'
   })}).then(response => {
    console.log(response)

    if (!response.ok) {
      throw new Error("Failed requst for tokens and claims")
    }

    return response.json()  
   })
   
 
   console.log(responseAuth0)
  
  setCookie(event, "cvtoken", responseAuth0.id_token)
  const claims = jwt.verify(
    responseAuth0.id_token,
    fs.readFileSync(process.cwd()+"/cert-dev.pem")
  )
  console.log(claims)

  const user = await client.user.findFirst({
    where: { email: claims.email}
  })
  setCookie(event, "cvuser", JSON.stringify(user))
  await sendRedirect(event, "/")
});
