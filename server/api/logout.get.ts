import { logoutRedirectUrl } from "./auth0"

export default defineEventHandler(async event => {
  const id_token = getCookie(event, "cvtoken")
  await setCookie(event, "cvtoken", "")
  await setCookie(event, "cvuser", "")
  //const { id_token } = await getQuery(event)
  console.log("asd", getCookie(event, "cvtoken"))
  await sendRedirect(event, logoutRedirectUrl(id_token as string) || "")
  //await sendRedirect(event, "/Search/?search=")
})