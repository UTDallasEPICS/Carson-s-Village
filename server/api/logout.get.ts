import { logoutRedirectUrl } from "./auth0"

export default defineEventHandler(async event => {
  const id_token = getCookie(event, "cvtoken")
  setCookie(event, "cvtoken", "")
  setCookie(event, "cvuser", "")
  //const { id_token } = await getQuery(event)

  await sendRedirect(event, logoutRedirectUrl(id_token as string) || "")
  //await sendRedirect(event, "/Search/?search=")
  return true;
})