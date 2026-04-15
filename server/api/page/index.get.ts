/*
*	/EditPage/cuid or /Page/cuid
*	function:	GET
*	retrive family page details from database
*/

export default defineEventHandler(async event => {
  const { cuid } = getQuery(event);

  if( (cuid as string) == "0" || cuid == undefined){
    throw createError({
      statusCode: 400,
      statusMessage: `Page ${cuid} is not allowed`
    });
  }

  const queryRes = await prisma.page.findFirst({
    where: {
      id: cuid as string
    },
    include: {
      Images: true,
      PageDonations: {
        orderBy: {
          donationInitiated: 'desc'
        },
      },
      Reply: {
        orderBy: {
          date: 'desc'
        }
      }
    }
  });

  if (!queryRes) {
    throw createError({
      statusCode: 404,
      statusMessage: `Could not find Page ${cuid}`
    });
  }

  return queryRes;
})
