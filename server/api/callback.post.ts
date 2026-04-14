import jwt from "jsonwebtoken"
import fs from "fs"
const runtime = useRuntimeConfig()

export default defineEventHandler(async event => {
  const body = await readBody(event)
  setCookie(event, "cvtoken", body.id_token)
  await sendRedirect(event, "/") 
});
