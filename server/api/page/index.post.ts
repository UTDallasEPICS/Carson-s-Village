import type { Image } from "@/types.d.ts"


/*
*	/EditPage/0
*	function:	POST
*	submit family page details to database
*/

export default defineEventHandler(async event => {
  const session = await auth.api.getSession({
    headers: event.headers
  })
  if (!session || !session.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }
  const user = session.user

  // extracting family id to connect the page to the authenticated user
  const {Images, Reply, PageDonations, userCuid, familyCuid, ...data} = await readBody(event)

  if(user.role === "advocate" || user.role == 'admin'|| user.id === userCuid ) {
    data.donation_goal = Math.trunc(data.donation_goal * 100);
    data.amount_raised = Math.trunc(data.amount_raised * 100);
    try {
      const family = await prisma.family.findFirst({
        where: {
          id: familyCuid as string
        }
      })

      data.status = family?.stripe_account_id ? 'active' : 'no family stripe account'
      // Creates a new entry in the database in the page model to a specfic user
      const queryRes = await prisma.page.create({
        data: {
          ...data, id: undefined,
          User: {
            connect: {
              id : userCuid
            }
          },
          Family: {
            connect: {
              id: familyCuid
            }
          }
        }
      });

      // Initially the images are not linked to a family page, so we add it here 
      // Reason: the cuid for the family page is created in the above in the creation query
      await Promise.all(
        Images.map(async (image: Image) => 
          await prisma.image.update({
            where: {
              id: image.id
            },
            data:{
              pageCuid: queryRes.id
            }
          })
        )
      )
    } catch(e) {
      console.error(e);
      throw createError({
        statusCode: 500,
        statusMessage: 'Something went wrong',
        cause: e
      });
    }
  } else {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }
});


