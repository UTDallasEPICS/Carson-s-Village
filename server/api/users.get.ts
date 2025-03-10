import {loginRedirectUrl} from "../api/auth0"

/*
*	/Users
*	function:	GET
*	retrive details of all users from database
*/

export default defineEventHandler(async event => {
  const { page_number, order, sortedColumn, familyCuid } = getQuery(event);
  
  if(event.context.user?.user_role === "advocate" || event.context.user?.user_role === "admin"){
    // Pagination via taking the absolute table page number with 12 records per page
    let orderBy = {};
    if (sortedColumn === 'family_name') {
      orderBy = { Family: { family_name: order || 'asc' }};
    } else if(sortedColumn === '_count') {
      orderBy = { Pages: { _count: order || 'asc' }};
    } 
    else {
      orderBy = { [(sortedColumn as string) || 'last_name']: order || 'asc' };
    }
    const [ count, count_family, all_family_users, userData, filtered_user_data, filtered_unsorted_users, unsortedUsers ] = await event.context.client.$transaction([
      event.context.client.user.count(),
      event.context.client.user.count({
        where: {
          Family: {
            cuid: familyCuid as string
          }
        },
      }),
    event.context.client.user.findMany({
        where: {
          user_role: "family"
        }
        }),
      event.context.client.user.findMany({
    orderBy: orderBy,
      skip: page_number as number * 12,
      take: 12,
      include: {
        AdvocateFamily: true,
        Pages: true,
        Family: true
      }
      }),
      event.context.client.user.findMany({
        where: {
          Family: {
            cuid: familyCuid as string
          }
        },
        orderBy: orderBy,
          skip: page_number as number * 12,
          take: 12,
          include: {
            AdvocateFamily: true,
            Pages: true,
            Family: true
          }
      }),
      event.context.client.user.findMany({
        where: {
          Family: {
            cuid: familyCuid as string
          }
        },
        skip: page_number as number * 12,
        take: 12,
        include: {
          AdvocateFamily: true,
          Pages: true,
          Family: true
        }
      }),
      event.context.client.user.findMany({
      skip: page_number as number * 12,
      take: 12,
      include: {
        AdvocateFamily: true,
        Pages: true,
        Family: true
      }
      })
  ]);
  return {
    Pagination: {
      total: count,
      total_family: count_family
    }, 
    all_family_users,
    all_sorted_data: userData,
    filtered_user_data: filtered_user_data,
    filtered_unsorted_user_data: filtered_unsorted_users,
    unsorted_data: unsortedUsers
  }
  } else {
    return await sendRedirect(event, loginRedirectUrl());
  }
})