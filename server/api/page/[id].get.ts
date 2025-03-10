
/*
*	/EditPage/cuid or /Page/cuid
*	function:	GET
*	retrive family page details from database
*/

export default defineEventHandler(async event => {
	const id = getRouterParam(event, 'id')

	if( (id as string) == "0" || id == undefined){
		return false
	}
	const queryRes = await event.context.client.page.findFirst({
	where: {
		cuid : id as string
	},
	include: {
		Images: true,
		PageDonations: {
			where: {
				success: true
			},
			orderBy: {
				donationDate: 'desc'
			},
	},
		Reply:{
			orderBy: {
				date: 'desc'
			}
		}, 
	}
	});
	  return queryRes;
})
