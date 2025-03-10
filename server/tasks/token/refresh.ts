const runtime = useRuntimeConfig()
const creds = runtime.CONSTANT_CONTACTS_CLIENTID + ':' + runtime.CONSTANT_CONTACTS_SECRET
const encodedCreds = btoa(creds)
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()
export default defineTask({
    meta: {
      name: "token:refresh",
      description: "Refresh Constant Contacts Token to be allowed to add users to the email list.",
    },
    async run({ payload, context }) {
      console.log("Running refresh task");
      const refreshTokenCount = await prisma.CC_Token.count()
      if(refreshTokenCount !== 0) {
        const tokens = await prisma.CC_Token.findFirst({
          where: {
            cuid: "0"
          }
        })
        
        if(Date.now() - tokens?.date.getTime() >  24 * 60 * 60 * 1000) {
          console.log("Error: access token expired")
          createError({
            status: 400,
            statusMessage: "Error: access token expired"
          })
        }
      }
      if(refreshTokenCount == 0) {
        console.log("Error: no access token created")
        throw createError({
          statusCode: 500,
          statusMessage: "Error: no access token created"
        })
      }

      const response = await fetch(`https://authz.constantcontact.com/oauth2/default/v1/token?refresh_token=${refreshToken.refresh_token as string}&grant_type=refresh_token`, {
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

      console.log("Constant Contacts token successfully refreshed")
      return { result: "Success" };
    },
  });