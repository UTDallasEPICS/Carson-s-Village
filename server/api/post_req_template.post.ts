import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default defineEventHandler(async event => {
  const body = readBody(event)
  const family = "";
  const page = "";

  return 'Hello page_donation'
})
