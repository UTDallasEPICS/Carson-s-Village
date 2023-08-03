import { PrismaClient } from "@prisma/client"
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"
const prisma = new PrismaClient()
const sesClient = new SESClient({ region: "us-east-1" });
import {loginRedirectUrl} from "../api/auth0"
import emailTemplates from "email-templates"

/*	/EditUser/0
*	  function:	POST
*	  submit user account details to database
*/
const runtime= useRuntimeConfig()
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

/*  try {
    await prisma.user.create({ data: event.context.body })
		const queryRes = await prisma.user.findFirst({ where: {cuid: event.context.user_id} });
    //const middleName = queryRes.middle_name ? ` ${queryRes.middle_name} ` : " "
    //
  } catch (e) {
		console.error(e); 
  }
*/

const body = await readBody(event)
//delete body.cuid
//console.log(event.context.user)
delete body.Pages
if(event.context.user?.user_role == "advocate"){
try{
  await sendEmail(body.email, "invitation", "Invitation to Carson's village", ({...body, url: `${runtime.BASEURL}api/login`}))
  // creates a new user entry in the user model/table.
  const queryRes = await prisma.user.create({
    data: {
      ...body,cuid:undefined,
      }
    });
  return true
  } catch(e){
    console.error(e);
    return false
  }
} else{
  return await sendRedirect(event, loginRedirectUrl());
}
})
