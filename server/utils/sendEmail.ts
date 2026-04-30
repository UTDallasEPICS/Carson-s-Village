import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2"
const sesClient = new SESv2Client({ region: "us-east-2" });
import emailTemplates from "email-templates"
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

const runtime = useRuntimeConfig();

export const sendEmail = async (to: string, template: string, subject: string, data: string) => {
  const { html, text } = await EmailTemplates.renderAll(template, data)
  const sendEmailCommand = new SendEmailCommand({
      FromEmailAddress: runtime.EMAIL_SOURCE_ADDRESS,
      Destination: { 
        ToAddresses: [to] 
      }, 
      Content: {
        Simple: {
          Subject: {
            Charset: "UTF-8",
            Data: subject
          },
          Body: {
            Html: {
              Charset: "UTF-8",
              Data: html
            },
            Text: {
              Charset: "UTF-8",
              Data: text
            }
          }
        }
      }
  });
  const res = await sesClient.send(sendEmailCommand)
};
