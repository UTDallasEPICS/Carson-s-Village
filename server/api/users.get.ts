/*
*	/Users
*	function:	GET
*	retrive details of all users from database
*/

export default defineEventHandler(async event => {
  const { page_number, order, sortedColumn } = getQuery(event);

  const { user } = await auth.api.getSession({
    headers: event.headers
  })

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }
  
  if(user.role === 'advocate' || user.role === 'admin') {
    // Pagination via taking the absolute table page number with 12 records per page
    let orderBy = {};
    if (sortedColumn === 'family_name') {
      orderBy = { Family: { family_name: order || 'asc' }};
    } else {
      orderBy = { [(sortedColumn as string) || 'last_name']: order || 'asc' };
    }
    const [ count, userData, unsortedUsers ] = await prisma.$transaction([
      prisma.user.count(),
      prisma.user.findMany({
        orderBy: orderBy,
        skip: page_number as number * 12,
        take: 12,
        include: {
          Pages: true,
          Family: true
        }
      }),
      prisma.user.findMany({
        skip: page_number as number * 12,
        take: 12,
        include: {
          Pages: true,
          Family: true
        }
      })
    ]);

    return {
      Pagination: {
        total: count
      }, 
      userData,
      unsorted_data: unsortedUsers
    }
  } else {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }
})
