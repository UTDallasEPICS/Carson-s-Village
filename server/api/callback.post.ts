import jwt from "jsonwebtoken"
import fs from "fs"
import { PrismaClient } from "@prisma/client"
const client = new PrismaClient()

export default defineEventHandler(async event => {
  const body = await readBody(event)
  setCookie(event, "cvtoken", body.id_token)
  const claims = jwt.verify(
    body.id_token,
    fs.readFileSync(process.cwd()+"/cert-dev.pem")
  )
  const user = await client.user.findFirst({
    where: { email: claims.email }
  })
  setCookie(event,"cvuser",JSON.stringify(user))
  await sendRedirect(event, "/")
});
