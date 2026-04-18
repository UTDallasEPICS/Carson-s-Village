export default defineNuxtRouteMiddleware(async (to, from) => {
  const { data: session } = await authClient.useSession(useFetch);

  if (!session.value || session.value.user.role !== 'admin' || session.value.user.role !== 'advocate') {
    return navigateTo('/Search/?search=')
  }
})
