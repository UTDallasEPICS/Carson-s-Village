

const runtime = useRuntimeConfig()
const creds = runtime.CONSTANT_CONTACTS_CLIENTID + ':' + runtime.CONSTANT_CONTACTS_SECRET
const encodedCreds = btoa(creds)
export default defineEventHandler(async event => {
  if (event.context.user.user_role === "admin")  {
    const refreshToken = await event.context.client.CC_Token.findFirst({
        where: {
          cuid: "0"
        }
      })

    const response = await fetch(`https://authz.constantcontact.com/oauth2/default/v1/token?refresh_token=${refreshToken.refresh_token as string}&grant_type=refresh_token`, {
        method: 'POST',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${encodedCreds}`
        }
      })

      const respBody = await response.json()

      const addToken = await event.context.client.CC_Token.upsert({
        where: {
          cuid: "0"
        },
        update: {
          token: respBody.access_token,
          refresh_token: respBody.refresh_token,
          date: new Date()
          
        },
        create: {
          token: respBody.access_token,
          refresh_token: respBody.refresh_token,
          date: new Date()
          
        }
      })

      await sendRedirect(event, `/EmailList?success=2`)
    }
  })
  