import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

/*
*	/EditPage/cuid or /Page/cuid
*	function:	GET
*	retrive family page details from database
*/

export default defineEventHandler(async event => {
		const { cuid } = getQuery(event);

		const queryRes = await prisma.page.findFirst({
       	where: {
			cuid : cuid as string
		  }
		  }
	  );
	  return queryRes;
		})
