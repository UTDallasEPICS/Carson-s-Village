const runtime = useRuntimeConfig()
const creds = runtime.CONSTANT_CONTACTS_CLIENTID + ':' + runtime.CONSTANT_CONTACTS_SECRET
const encodedCreds = btoa(creds)

export default defineEventHandler(async event => {
  const { user } = await auth.api.getSession({
    headers: event.headers
  })

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }

  const { code } = getQuery(event)

  if(user.role === "admin") {

    const response = await fetch(`https://authz.constantcontact.com/oauth2/default/v1/token?code=${code as string}&redirect_uri=${encodeURIComponent(`${runtime.BASEURL}api/cc_callback`)}&grant_type=authorization_code`, {
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${encodedCreds}`
      }
    })

    const respBody = await response.json()

    const addToken = await prisma.CC_Token.upsert({
      where: {
        id: "0"
      },
      update: {
        token: respBody.access_token,
        refresh_token: respBody.refresh_token,
        date: new Date()
        
      },
      create: {
        token: respBody.access_token,
        refresh_token: respBody.refresh_token,
      }
    })
    await sendRedirect(event, `/EmailList`)
  }
  else {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }
})
