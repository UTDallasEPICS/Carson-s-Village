export default defineNuxtRouteMiddleware(async (to, from) => {
  const { data: session } = await authClient.useSession(useFetch);

  if (!session.value || session.value.role !== 'admin' || session.value.role !== 'advocate' || session.value.role !== 'family') {
    return navigateTo('/Search/?search=')
  }
})
