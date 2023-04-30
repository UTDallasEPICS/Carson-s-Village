import {nanoid} from "nanoid"
const state = {}; 
const genState = () => { const s = nanoid(); state[s] = 1;  return s}
export const loginRedirectUrl = () => `${process.env.ISSUER}/authorize?response_type=id_token&response_mode=form_post&client_id=${process.env.AUTH0_CLIENTID}&scope=email&redirect_uri=${encodeURIComponent(process.env.BASEURL!+"/api/callback")}&nonce=${genState()}`

export const verifyNonce = (nonce: string) => {
  if (state[nonce]) {
    delete state[nonce]
    return true
  }
  return false
}