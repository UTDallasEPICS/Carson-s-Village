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
const runtime = useRuntimeConfig()
export default defineEventHandler(async event => {
const body = await readBody(event);
const now = (new Date()).toString();
if(event.context.user?.user_role == "advocate" || event.context.user.user_role === "admin") {
    const queryRes = await prisma.user.create({
        data: {
          ...body,createdAt: now, updatedAt: "", cuid: undefined,
          AdvocateResponsible: {
            connect: {
                cuid: (event.context.user.cuid as string) || "0"
          },
          Page: {
            connect: {
              cuid: body.pageCuid
            }
          } // todo add family members
          /* wait why am I doing?
          familyMembers: {
            connect: {
              cuid:

          */
        }
    }
    })
    }
        return ""
})