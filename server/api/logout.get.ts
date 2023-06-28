import { logoutRedirectUrl } from "./auth0"

export default defineEventHandler(async event => {
  setCookie(event, "cvtoken", "")
  setCookie(event, "cvuser", "")
  const { id_token } = await getQuery(event)

  await sendRedirect(event, logoutRedirectUrl(id_token as string) || "")
  await sendRedirect(event, "/Search/?search=")
  return true;
})