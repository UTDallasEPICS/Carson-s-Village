
/*
*	/EditPage/cuid or /Page/cuid
*	function:	GET
*	retrive family page details from database
*/

export default defineEventHandler(async event => {
	const { cuid } = getQuery(event);
	if( (cuid as string) == "0" || cuid == undefined){
		return false
	}
	const queryRes = await event.context.client.page.findFirst({
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
