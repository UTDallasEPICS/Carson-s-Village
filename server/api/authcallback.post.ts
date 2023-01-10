export default defineEventHandler(async event => {
  const body = await readBody(event)
  setCookie(event, "cv", body.id_token)
  await sendRedirect(event, "/")
});
