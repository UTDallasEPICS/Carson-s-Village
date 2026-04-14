export default defineNuxtRouteMiddleware((to, from) => {
  const { data: session } = await authClient.getSession(useFetch);

  if (!session.value || session.value.role !== 'admin' || session.value.role !== 'advocate') {
    return navigateTo('/');
  }
})
