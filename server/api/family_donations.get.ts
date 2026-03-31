import {loginRedirectUrl} from "../api/auth0"

/*
*	/FamilyTransactionList
*	function:	GET
*	retrive family all pages donation details from database
*/

export default defineEventHandler(async event => {
  const { family_cuid } = getQuery(event);
  if(event.context.user?.user_role === "admin") {
    if((family_cuid as string) == "0" || family_cuid == undefined) {
        return []
    }
    const donationsToUpdate = await event.context.client.pageDonation.findMany({
      where: {
        familyCuid: family_cuid as string,
        status: "SUCCESS",
        availableOn: {
          not: null,
          lt: new Date()
        }
      }
    });

    if (donationsToUpdate.length > 0) {
      let pageBalanceUpdates: Record<string, number> = {};

      donationsToUpdate.forEach(donation => {
        pageBalanceUpdates[donation.pageCuid] = (pageBalanceUpdates[donation.pageCuid] ?? 0) + donation.net;
      });

      // Update page available balances
      await event.context.client.$transaction([
        event.context.client.pageDonation.updateMany({
          where: {
            cuid: { in: donationsToUpdate.map(d => d.cuid) },
          },
          data: {
            status: "DEPOSITED"
          }
        }),
        ...Object.entries(pageBalanceUpdates).map( ([id, amount]) => {
          return event.context.client.page.update({
            where: { 
              cuid: id 
            },
            data: {
              amount_available: {
                increment: amount
              }
            }
          });
        })
      ]);
    }

    const queryRes = await event.context.client.pageDonation.findMany({
        where: {
          familyCuid: family_cuid as string,
          status: "DEPOSITED"
        },
        include: {
          Page: true
        }
    });
    return queryRes;
  } else {
    return await sendRedirect(event, loginRedirectUrl());
  }
})
