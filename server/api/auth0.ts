import {nanoid} from "nanoid"

const state = {}; 
const genState = () => { const s = nanoid(); state[s] = 1;  return s}
const runtime = useRuntimeConfig()

export const loginRedirectUrl = () => `${runtime.ISSUER}authorize?response_type=id_token&response_mode=form_post&client_id=${runtime.AUTH0_CLIENTID}&scope=openid%20email&redirect_uri=${encodeURIComponent(runtime.BASEURL!+"api/callback")}&nonce=${genState()}`
export const logoutRedirectUrl = (id_token: string) => `${runtime.ISSUER}oidc/logout?id_token_hint=${id_token}&post_logout_redirect_uri=${encodeURIComponent(runtime.BASEURL!+"api/login")}&nonce=${genState()}`
//change to post_logout_url=${encodeURIComponent(runtime.BASEURL!+"/api/callback")}

export const verifyNonce = (nonce: string) => {
  if (state[nonce]) {
    delete state[nonce]
    return true
  }
  return false
}