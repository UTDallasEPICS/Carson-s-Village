import { PrismaClient } from "@prisma/client"
import { donationFormat } from "@/utils"
const prisma = new PrismaClient()

/*
*	/EditPage/0
*	function:	POST
*	submit family page details to database
*/

export default defineEventHandler(async event => {
  //extracting family id to connect the page to the authenticated user
  const {Images, ...data} = await readBody(event)
  const familyCuid = data.familyCuid;
  delete data.familyCuid;
  data.donation_goal = Math.trunc(data.donation_goal * 100);
  data.amount_raised = Math.trunc(data.amount_raised * 100);

  try{
  // Creates a new entry in the database in the page model to a specfic user
  //if(event.context.user.user_role === "advocate" || event.context.user.cuid === familyCuid ){
  const queryRes = await prisma.page.create({
    data: {
      ...data,cuid: undefined,
      User: {
        connect: {
          cuid : familyCuid || "0"
        }
      
        }
      }
    });
    return queryRes.cuid
  //}
  //return []
  } catch(e) {
    console.error(e);
  }
});


