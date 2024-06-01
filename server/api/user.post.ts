import { PrismaClient } from "@prisma/client"
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"
const prisma = new PrismaClient()
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
if(event.context.user?.user_role === "advocate" || event.context.user.user_role === "admin"){
  try{
    // creates a new user entry in the user model/table.
    if(body.user_role == "advocate" || (body.user_role == "admin" && event.context.user?.user_role === "admin")) {
      delete body.pages
      delete body.AdvocateFamily
      const queryRes = await prisma.user.create({
        data: {
          ...body, cuid: undefined, familyCuid: undefined
          }
        });
        await sendEmail(body.email, "invitation", "Invitation to Carson's village", ({...body, url: `${runtime.BASEURL}api/login`}))
      } else if(body.user_role == "family") {
        const pages = body.pages
        delete body.Pages
        const userRes = await prisma.user.create({
          data: {
            ...body, cuid: undefined,
            }})
        const queryRes = await prisma.family.update({
          where: { cuid: body.familyCuid },
          data: {
            Pages: pages, updated_at: now,
            FamilyMembers: {
              connect: {
                cuid: userRes.cuid
              }
            }, 
        }
      }
       )}
       
    return true
    } catch(e){
      console.error(e);
      return false
    }
} else{
  return await sendRedirect(event, loginRedirectUrl());
}
})
