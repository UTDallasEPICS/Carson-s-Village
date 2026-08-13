import { authClient } from '~/utils/auth-client'

export default defineNuxtRouteMiddleware(async () => {
  const { data: session } = await authClient.useSession(useFetch)

  if (session.value) {
    return navigateTo('/', { replace: true })
  }
})
