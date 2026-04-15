import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"
const sesClient = new SESClient({ region: "us-east-2" });

import emailTemplates from "email-templates"

/*	/EditUser/0
*	  function:	POST
*	  submit family and first user account details to database
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

  const {
    family_name,
    first_name,
    email,
    middle_name,
    last_name,
    phone, 
    address 
  } = body

  if(session.role === "advocate" || session.role === "admin") {
    try {
      const queryRes = await prisma.family.create({
        data: {
          family_name: family_name,
          AdvocateResponsible: {
            connect: {
              id: session.id
            }
          },
          FamilyMembers: {
            create: {
              name: `${first_name ? first_name : ''}${middle_name ? middle_name : ' '}${last_name}`,
              email,
              phone,
              address,
            }
          }
        }
      })

      // Refactor to use new login
      await sendEmail(body.email, "invitation", "Invitation to Carson's village", ({...body, url: `${runtime.BASEURL}api/login`}))
      return queryRes
    } catch (e) {
      console.error(e)
      throw createError({
        statusCode: 500,
        statusMessage: 'Something went wrong',
        cause: e
      });
    }
  }
  else {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }
})
