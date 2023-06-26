export default defineEventHandler(async event => {
  setCookie(event, "cvtoken", "")
  setCookie(event, "cvuser", "")
  //const body = await readBody(event)
  //console.log(body)
  //console.log("logout")
  await sendRedirect(event, "/Search/?search=")
})