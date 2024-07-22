import {nanoid} from "nanoid"

const state = {}; 
const genState = () => { const s = nanoid(); state[s] = 1;  return s}
const runtime = useRuntimeConfig()

const nanoidString = nanoid()
const redirectURI = `${runtime.BASEURL}/api/cc_callback`

  export default defineEventHandler(async event => {
    if (event.context.user.user_role === "admin")  {
      const authRequestUrl = () => `https://authz.constantcontact.com/oauth2/default/v1/authorize?client_id=${runtime.CONSTANT_CONTACTS_CLIENTID}&redirect_uri=${encodeURIComponent(redirectURI)}&response_type=code&scope=account_read%20account_update%20contact_data%20offline_access&state=${nanoidString}`

      await sendRedirect(event, authRequestUrl())

    }
  })