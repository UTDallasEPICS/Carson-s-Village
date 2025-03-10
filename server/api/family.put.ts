/*	/EditFamily/cuid
*	  function:	PUT
*	  submit updated family details to database
*/
const runtime = useRuntimeConfig()
export default defineEventHandler(async event => {

const body = await readBody(event);
//const now = (new Date()).toISOString();
  const { familyCuid, family_name,
    first_name,
    email,
    middle_name,
    last_name,
    phone, address, existingUser } = body
console.log(body)
if(event.context.user?.user_role === "advocate" || event.context.user?.user_role === "admin") {
    try {
        const queryRes = await event.context.client.family.update({
          where: {
            cuid: familyCuid as string
          },
          data: {
            family_name: family_name,
            //AdvocateResponsible: {
            //  connect: { cuid: event.context.user?.cuid }
            //},
            updated_at: new Date(),
            //FamilyMembers: {
            //  connect: {
            //    cuid: cuid
            //  }
            //}
        }
      })
      return queryRes
    } catch (e) {
      console.log(e)
    }
  }
    return false
})