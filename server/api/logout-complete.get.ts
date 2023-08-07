export default defineEventHandler(async event => {
    setCookie(event, "cvtoken", "")
    setCookie(event, "cvuser", "")
    await sendRedirect(event, "/Search/?search=")
  })