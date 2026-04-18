export default defineNuxtRouteMiddleware(async (to, from) => {
  const { data: session } = await authClient.useSession(useFetch);

  if (!session.value && session.value.user.role !== 'admin' && session.value.user.role !== 'advocate' && session.value.user.role !== 'family') {
    return navigateTo('/Search/?search=')
  }
})
