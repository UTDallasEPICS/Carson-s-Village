import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default defineEventHandler(async event => {{
      const queryRes = prisma.CC_Token.findUnique({
        include: {
          token: true
      }
    });
    return queryRes;
    } else {
      return await sendRedirect(event, `/EmailList?success=1`)
    }
  })