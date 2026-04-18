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
  
  if (user.role === "admin") {
    let refreshToken = null
    const refreshTokenCount = await prisma?.CC_Token.count()
    if(refreshTokenCount !== 0) {
      refreshToken = await prisma.CC_Token.findFirst({
        where: {
          id: "0"
        }
      })
      
      if(Date.now() - refreshToken?.date.getTime() >  24 * 60 * 60 * 1000) {
        console.log("Error: access token expired")
        throw createError({
          status: 400,
          statusMessage: "Error: access token expired"
        })
      }
    }
    else {
      console.log("Error: no access token present")
      createError({
        status: 400,
        statusMessage: "Error: no access token present"
      })
    }

    const response = await fetch(`https://authz.constantcontact.com/oauth2/default/v1/token?refresh_token=${refreshToken?.refresh_token as string}&grant_type=refresh_token`, {
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${encodedCreds}`
      }
    })

    const respBody = await response.json()

    if(!response.ok) {
      console.log(response.statusText)
      throw createError({
        statusCode: 500,
        message: "Failed to refresh token / Internal Server Error" 
      })
    }

    const addToken = await prisma?.CC_Token.upsert({
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
        date: new Date()
        
      }
    })
    
    return { statusMessage: "successfully refreshed token", statusCode: 200} 
  }
  else {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }
})
