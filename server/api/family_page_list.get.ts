import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
// Experimental API endpoint to attempt to process both userCuid and familyCuid 
export default defineEventHandler(async event => {
  const { cuid } = getQuery(event)
  const result = await prisma.page.findMany({
    where: { 
      Family: {
        cuid: cuid as string
      },
      User: {
        cuid: cuid as string
      }
    }
  })

  return result
})
