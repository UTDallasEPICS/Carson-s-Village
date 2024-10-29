import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import {loginRedirectUrl} from "../api/auth0"

export default defineEventHandler(async event => {
  const { advocate_cuid } = getQuery(event)
  if(event.context.user?.user_role === "advocate" || event.context.user?.user_role === "admin") {
    const result = await prisma.family.findMany({
      where: { 
          advocateCuid: advocate_cuid as string
      },
      include: {
        Pages: true
      } 
    })
    return result
  } else {
    return await sendRedirect(event, loginRedirectUrl())
  }
})
