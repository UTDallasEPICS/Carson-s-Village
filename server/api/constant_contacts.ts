import {nanoid} from "nanoid"

const state = {}; 
const genState = () => { const s = nanoid(); state[s] = 1;  return s}
const runtime = useRuntimeConfig()

export const authRequestUrl = () => `https://authz.constantcontact.com/oauth2/default/v1/authorize?client_id=${runtime.CONSTANT_CONTACT_CLIENTID}&redirect_uri=${runtime.BASE_URL}&response_type=code&scope=account_read%20account_update%20contact_data%20offline_access&state=${body.state}&nonce=${genState()}`

export const verifyNonce = (nonce: string) => {
    if (state[nonce]) {
      delete state[nonce]
      return true
    }
    return false
  }