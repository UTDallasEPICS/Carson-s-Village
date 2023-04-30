export default defineEventHandler(async event => {
  setCookie(event, "cvtoken", "")
  await sendRedirect(event, "/login")
})