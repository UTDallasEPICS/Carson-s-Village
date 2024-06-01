import { PrismaClient } from "@prisma/client"
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"
const prisma = new PrismaClient()
const sesClient = new SESClient({ region: "us-east-1" });
import {loginRedirectUrl} from "../api/auth0"
import emailTemplates from "email-templates"

/*	/EditUser/0
*	  function:	POST
*	  submit family and first user account details to database
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
  
  const sendEmail = async (to:string, template:string, subject:string, data:string) => {
    const { html, text } = await EmailTemplates.renderAll(template, data)
    const sendEmailCommand = new SendEmailCommand({
      Destination: { ToAddresses: [to] }, 
      Message: {Subject: {Charset: "UTF-8", Data: subject},Body:{Html: {Charset: "UTF-8", Data: html}, Text:{Charset: "UTF-8", Data: text}}},
      Source: runtime.EMAIL_SOURCE_ADDRESS,
    })
    const res = await sesClient.send(sendEmailCommand)
  };

const body = await readBody(event);
//const now = (new Date()).toISOString();
  const { family_name,
    first_name,
    email,
    middle_name,
    last_name,
    phone, address } = body
if(event.context.user?.user_role == "advocate" || event.context.user.user_role === "admin") {
    try {
      await sendEmail(body.email, "invitation", "Invitation to Carson's village", ({...body, url: `${runtime.BASEURL}api/login`}))
      const queryRes = await prisma.family.create({
        data: {
          family_name: family_name,
          AdvocateResponsible: {
            connect: { cuid: event.context.user.cuid }
          },
          created_at: new Date(),
          updated_at: null,
          cuid: undefined,
          FamilyMembers: {
            create: {
              first_name,
              email,
              middle_name,
              last_name,
              phone,
              address,
            }
          }
        }
      }
   )
      return queryRes
    } catch (e) {
      console.log(e)
    }
  }
    return false
})