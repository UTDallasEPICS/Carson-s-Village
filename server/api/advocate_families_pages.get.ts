import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default defineEventHandler(async event => {
  const { advocate_cuid } = getQuery(event)
  const result = await prisma.family.findMany({
    where: { 
        advocateCuid: advocate_cuid as string
    },
    include: {
      Pages: true
    } 
  })

  return result
})
