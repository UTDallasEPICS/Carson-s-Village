export default defineEventHandler(async event => {
  await sendRedirect(event, process.env.AUTH0_URL)
})