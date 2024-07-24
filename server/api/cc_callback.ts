
const runtime = useRuntimeConfig()

const creds = runtime.CONSTANT_CONTACTS_CLIENTID + ':' + runtime.CONSTANT_CONTACTS_SECRET
const encodedCreds = btoa(creds)

export default defineEventHandler(async event => {
    const { code } = getQuery(event)
    
    if (code) {
      console.log(code)
    } else {
      console.log('Authorization code not found')
    }

    const response = await fetch(`https://authz.constantcontact.com/oauth2/default/v1/token?code=${code as string}&redirect_uri=${encodeURIComponent(`${runtime.BASEURL}api/cc_callback`)}&grant_type=authorization_code`, {
        method: 'POST',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${encodedCreds}`
        }
      })

      const accessToken = (await response.json()).access_token

      

      console.log(accessToken)
  })
  