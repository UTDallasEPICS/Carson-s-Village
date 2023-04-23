import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()


export default defineEventHandler(async event => {

  // check if role == advocate?
  const { familyCuid } = getQuery(event);
	const cookiecooks = getCookie(event, "cv");
	const { Cuid } = JSON.parse(cookiecooks || "{}")
	console.log(familyCuid);
	console.log(Cuid);

	const { pageDataTotal } = getQuery(event);
	/*  try{
		const user = await prisma.userAccount.findFirst({
      where: {email:event.context.oidc.user.email}
    })
		const roleCheck = await prisma.userAccount.findFirst({
      where: {cuid: event.params.user_id}
    })

		// Can access account only if cuid matches OR user is an admin

		if(user.cuid == roleCheck.cuid || user.user_role == "advocate"){
			//build select query
			var text = 'SELECT * FROM page_details WHERE familyCuid = $1 AND page_name = $2';
			//set condition values
			values = [req.params.user_id, req.params.page_name];
			/*
			*	query database
			*		if successful, use query result to generate family-page.pug template
			*		if failed, print error to console
			*/
      /*const queryRes = await prisma.page.findFirst({
        where: {
			cuid : Cuid, 
			page_name: event.context.page_name
		  },
		include: {
		  Images: {
			select: {
			  url: true
		  }
		  }
		}
		})*/
		//const media = queryRes.Images.map(({url}) => url)
		return true;
      });
  /*const body = await readBody(event)
  setCookie(event, "cv", body.id_token)
  setCookie(event, "role", body.id_token)*/

 // await sendRedirect(event, "/")

