
const runtime = useRuntimeConfig()
const getQuery = (event) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams
  }

export default defineEventHandler(async event => {
    const query = getQuery(event)
    const authCode = query.code
  
    if (authCode) {
      console.log(authCode)
    } else {
      console.log('Authorization code not found')
    }

    const body = new URLSearchParams({
        code: authCode,
        redirect_uri: runtime.BASEURL,
        grant_type: 'authorization_code'
      })

    const headers = new Headers({
        "Accept", "application/json"
        "Content-Type", "application/x-www-form-urlencoded"
    })

    const response = await fetch(`https://authz.constantcontact.com/oauth2/default/v1/token`, {
        method: 'POST',
        body: body.toString(),
        headers: headers
      })
  })
  