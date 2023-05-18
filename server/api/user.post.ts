import { PrismaClient } from "@prisma/client"
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"
//import { emailTemplates } from "email-templates'"
const prisma = new PrismaClient()
const sesClient = new SESClient({ region: "us-east-1" });
//const EmailTemplates = require()

export default defineEventHandler(async event => {




/*const emailTemplates = new EmailTemplates({
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
})*/
/*
module.exports = async (to, template, subject, data) => {
  const { html, text } = await emailTemplates.renderAll(template, data)
  const sendEmailCommand = new SendEmailCommand({
    Destination: { ToAddresses: [to] }, 
    Message: {Subject: {Charset: "UTF-8", Data: subject},Body:{Html: {Charset: "UTF-8", Data: html}, Text:{Charset: "UTF-8", Data: text}}},
    Source: process.env.EMAIL_SOURCE_ADDRESS,
  })
  const res = await sesClient.send(sendEmailCommand)
};

  try {
    await prisma.user.create({ data: event.context.body })
		const queryRes = await prisma.user.findFirst({ where: {cuid: event.context.user_id} });
    //const middleName = queryRes.middle_name ? ` ${queryRes.middle_name} ` : " "
    //await sendEmail(event.context.body.email, "invitation", "Invitation to Carson's village", ({...event.context.body, url: `${process.env.BASEURL}/login`}))
  } catch (e) {
		console.error(e); 
  }
*/

const body = await readBody(event)
//setCookie(event, 'cvuser',JSON.stringify(body))
try{
  await prisma.user.create({
    data: {
      ...body,

      }
    });
  } catch(e){
    console.log(e);
  }
  return true;
})
