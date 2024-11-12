import {loginRedirectUrl} from "../api/auth0"

/*
*	/PageList/cuid
*	function:	POST
*	retrive family pages details from database for user's or family's cuid
*/

export default defineEventHandler(async event => {
    const { cuid, page_number } = getQuery(event);
    console.log(cuid as string)
    
    if((cuid as string) == "0"  || cuid == undefined){
        return []
    }

    if(event.context.user?.user_role === "admin" && cuid === "") {
      const [count, pagesResult] = await event.context.client.$transaction([
        event.context.client.page.count(),
        event.context.client.page.findMany({
        skip: page_number as number * 12,
        take: 12,
        include: {
          User: true, 
          Family: {
            include: {
              AdvocateResponsible: true
            }
          }
      }})
      ])
      //console.log(pagesResult)
      return {
        Pagination: {
        total:  count
        }, 
        data:  pagesResult
      };
    } else if(event.context.user?.user_role === "advocate" && cuid === "") {
      const [count, pagesResult] = await event.context.client.$transaction([
        event.context.client.page.count({
          where: {
            Family: {
              AdvocateResponsible: {
                cuid: event.context.user?.cuid
              }
            },
          } 
        }),
        event.context.client.page.findMany({
        skip: page_number as number * 12,
        take: 12,
        where: {
          Family: {
            AdvocateResponsible: {
              cuid: event.context.user?.cuid
            }
          },
        },
        include: {
          User: true, 
          Family: {
            include: {
              AdvocateResponsible: true
            }
          }
      }})
      ])
      //console.log("here", pagesResult)
      return {
        Pagination: {
        total:  count
        }, 
        data:  pagesResult
      };
    } else if(event.context.user?.user_role === "admin" && cuid !=="" || event.context.user?.user_role === "advocate" && cuid !==""  || event.context.user?.cuid == cuid ||  event.context.user?.familyCuid == cuid){
      const [count, pagesResult, pagesUnpaginated] = await event.context.client.$transaction([
        event.context.client.page.count({ where: {
          OR: [ { 
            userCuid: cuid as string },
            {
            familyCuid: cuid as string
          } ]
      }}),
         event.context.client.page.findMany({
            where: {
              OR: [ {
                userCuid: cuid as string,
              }, {
                familyCuid: cuid as string 
              }
              ]
              },
                  skip: page_number as number * 12,
                  take: 12,
                  include: {
                    User: true,
                    Family: {
                      include: {
                        AdvocateResponsible: true
                      }
                    }
                  }
                }),
        event.context.client.page.findMany({
          where: {
            OR: [ {  
              userCuid: cuid as string },
            {
              familyCuid: cuid as string
            } ]
          }, include: {
            User: true, 
            Family: {
              include: {
                AdvocateResponsible: true
            }
          }
          }
              })
  ])

  //console.log(pagesResult)
    return {
      Pagination: {
      total: count },
      data:  pagesResult,
      raw_data: pagesUnpaginated
    };
  } else {
    return await sendRedirect(event, loginRedirectUrl());
  }
})
