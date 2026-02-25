export default defineNuxtRouteMiddleware((to, from) => {
  const cvuser = useCookie("cvuser")
  const role = cvuser.value?.user_role

  if (role != "advocate" && role != "admin") {
    return navigateTo("/")
  }
})
