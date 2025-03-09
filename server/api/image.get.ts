
/*
*	/EditPage/cuid and /Page/cuid
*	function:	POST
*	retrive family page images from database
*/

export default defineEventHandler(async event => {
  const { pageCuid } = getQuery(event)

  // retrives all the images that belong to a family page to a family page
  const queryRes = await event.context.client.image.findMany({
      where: {
          pageCuid : pageCuid as string
        }
        }
    );
    return queryRes; 
});