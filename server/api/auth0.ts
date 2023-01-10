import {nanoid} from "nanoid"
const state = {}; 
const genState = () => { const s = nanoid(); state[s] = 1;  return s}
export const loginRedirectUrl = () => `${process.env.NUXT_ENV_AUTH0_URL}/authorize?response_type=id_token&response_mode=form_post&client_id=${process.env.NUXT_ENV_AUTH0_CLIENTID}&scope=email&redirect_uri=${encodeURIComponent(process.env.NUXT_ENV_AUTH0_CALLBACK)}&nonce=${genState()}`

export const verifyNonce = (nonce: string) => {
  if (state[nonce]) {
    delete state[nonce]
    return true
  }
  return false
}