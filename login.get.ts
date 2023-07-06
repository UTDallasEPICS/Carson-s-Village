import { loginRedirectUrl } from "server/api/auth0"

export default defineEventHandler(async event => {
  await sendRedirect(event, loginRedirectUrl() || "")
})