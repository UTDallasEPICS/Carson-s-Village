export default defineEventHandler(async event => {
  setCookie(event, "cvtoken", null)
  await sendRedirect(event, "/login")
})