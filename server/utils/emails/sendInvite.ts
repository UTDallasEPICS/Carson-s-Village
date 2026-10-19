import InviteTemplate from '~~/emails/invite.vue';
import { render } from '@vue-email/render';
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2"

const sesClient = new SESv2Client({ region: "us-east-2" });
const runtime = useRuntimeConfig();

const url = runtime.BETTER_AUTH_URL;
const subject = "You're Invited to Carson's Village";

export async function sendInvite(email: String, name: String): void  {

  const html = await render(InviteTemplate, {
    name,
    url
  });

  const text = await render(InviteTemplate, {
    name,
    url,
  }, {
      plainText: true,
  });

  const sendEmailCommand = new SendEmailCommand({
      FromEmailAddress: runtime.EMAIL_SOURCE_ADDRESS,
      Destination: { 
        ToAddresses: [email] 
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
}
