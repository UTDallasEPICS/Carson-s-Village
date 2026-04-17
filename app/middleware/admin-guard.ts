export default defineNuxtRouteMiddleware(async (to, from) => {
  const { data: session } = await authClient.useSession(useFetch);

  if (!session.value || session.value.role !== 'admin') {
    return navigateTo('/Search/?search=')
  }
})
