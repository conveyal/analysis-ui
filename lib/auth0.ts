import {initAuth0} from '@auth0/nextjs-auth0'
import ms from 'ms'

const cookieLifetime = ms('30 days') / 1000
const httpTimeout = ms('10s')
const scope = 'openid profile id_token'
const redirectUri = process.env.AUTH0_REDIRECT_URI

/**
 * Read the origin from the request to configure the redirect urls
 */
export default initAuth0({
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  scope,
  domain: process.env.AUTH0_DOMAIN,
  redirectUri: `${redirectUri}/api/callback`,
  postLogoutRedirectUri: redirectUri,
  session: {
    cookieSecret: process.env.SESSION_COOKIE_SECRET,
    cookieLifetime,
    storeIdToken: true
  },
  oidcClient: {
    httpTimeout
  }
})
