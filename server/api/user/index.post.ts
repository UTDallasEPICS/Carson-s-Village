import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"
const sesClient = new SESClient({ region: "us-east-2" });

import emailTemplates from "email-templates"

/*	/EditUser/0
*	  function:	POST
*	  submit user account details to database
*/
const runtime = useRuntimeConfig()
export default defineEventHandler(async event => {
  const session = await auth.api.getSession({
    headers: event.headers
  })

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }

  const EmailTemplates = new emailTemplates({
    views: {
      root: "./emails",
    },
    juice: true,
    juiceResources: {
      preserveImportant: true,
      webResources: {
        relativeTo: "./emails",
      },
    },
  })

  const sendEmail = async (to: string, template: string, subject: string, data: string) => {
    const { html, text } = await EmailTemplates.renderAll(template, data)
    const sendEmailCommand = new SendEmailCommand({
      Destination: { ToAddresses: [to] }, 
      Message: {Subject: {Charset: "UTF-8", Data: subject},Body:{Html: {Charset: "UTF-8", Data: html}, Text: {Charset: "UTF-8", Data: text}}},
      Source: runtime.EMAIL_SOURCE_ADDRESS,
    })
    const res = await sesClient.send(sendEmailCommand)
  };

  const body = await readBody(event)
  const now = (new Date()).toISOString();

  if(session.role === "advocate" || session.role === "admin") {
    try{
      // creates a new user entry in the user model/table.
      if(body.user_role == "advocate" || (body.user_role == "admin" && session.role === "admin")) {
        delete body.Pages
        delete body.AdvocateFamily
        const queryRes = await prisma.user.create({
          data: {
            ...body, id: undefined, familyId: undefined
            }
          });
        
          // TODO: Move this to better-auth login
          await sendEmail(body.email, "invitation", "Invitation to Carson's village", ({...body, url: `${runtime.BASEURL}api/login`}))
          return { success: true, result: queryRes }
      } 
      else if (body.user_role == "family") {
        delete body.Pages
        delete body.AdvocateFamily

        const userRes = await prisma.user.create({
          data: {
            ...body, id: undefined,
          }
        })

        const queryRes = await prisma.family.update({
          where: { id: body.familyCuid },
          data: {
            updated_at: now,
            FamilyMembers: {
              connect: {
                id: userRes.cuid
              }
            }, 
          }
        })

        // TODO: Move this to better-auth
        await sendEmail(body.email, "invitation", "Invitation to Carson's village", ({...body, url: `${runtime.BASEURL}api/login`}))
        return { success: true, result: queryRes }
      }
         
      } catch(e: any){
        let error = e as string || undefined
        throw createError({
          statusCode: 500,
          message: e.message as unknown as string,
        })
      }
  } else{
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }
})
