import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

/*
*	/EditPage/cuid or /Page/cuid
*	function:	GET
*	retrive family page details from database
*/

export default defineEventHandler(async event => {
		const { cuid } = getQuery(event);
		const role = event.context.user?.user_role || ""
		if( (cuid as string) == "0" || cuid == undefined){
			return false
		}
		const queryRes = await prisma.page.findFirst({
      where: {
			  cuid : cuid as string
		  },
		  include: {
        Images: true,
        PageDonations: {
          where: {
            success: true
          }
        },
        Reply: true
		  }
		});
	  return queryRes;
})
