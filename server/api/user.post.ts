import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"
const sesClient = new SESClient({ region: "us-east-1" });
import { loginRedirectUrl } from "../api/auth0"
import emailTemplates from "email-templates"

/*	/EditUser/0
*	  function:	POST
*	  submit user account details to database
*/
const runtime = useRuntimeConfig()
export default defineEventHandler(async event => {

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
console.log(body.AdvocateFamily)
if(event.context.user?.user_role === "advocate" || event.context.user?.user_role === "admin") {
  try{
    // creates a new user entry in the user model/table.
    if(body.user_role == "advocate" || (body.user_role == "admin" && event.context.user?.user_role === "admin")) {
      delete body.Pages
      delete body.AdvocateFamily
      const queryRes = await event.context.client.user.create({
        data: {
          ...body, cuid: undefined, familyCuid: undefined
          }
        });
        await sendEmail(body.email, "invitation", "Invitation to Carson's village", ({...body, url: `${runtime.BASEURL}api/login`}))
        return { success: true, result: queryRes }
      } else if(body.user_role == "family") {
        delete body.Pages
        delete body.AdvocateFamily
        const userRes = await event.context.client.user.create({
          data: {
            ...body, cuid: undefined,
        }})
        const queryRes = await event.context.client.family.update({
          where: { cuid: body.familyCuid },
          data: {
            updated_at: now,
            FamilyMembers: {
              connect: {
                cuid: userRes.cuid
              }
            }, 
        }
      } 
       )
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
  return await sendRedirect(event, loginRedirectUrl());
}
})
