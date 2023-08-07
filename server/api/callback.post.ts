import jwt from "jsonwebtoken"
import fs from "fs"
import { PrismaClient } from "@prisma/client"
const client = new PrismaClient()
const runtime = useRuntimeConfig()
export default defineEventHandler(async event => {
  const body = await readBody(event)
  setCookie(event, "cvtoken", body.id_token)
  await sendRedirect(event, "/") 
});
