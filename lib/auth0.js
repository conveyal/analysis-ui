import {initAuth0} from '@auth0/nextjs-auth0'
import ms from 'ms'

const cookieLifetime = ms('30 days') / 1000
const httpTimeout = ms('10s')
const scope = 'openid profile id_token'

/**
 * Read the origin from the request to configure the redirect urls
 */
export default (req) => {
  const host = req.headers.host
  const protocol = /^localhost(:\d+)?$/.test(host) ? 'http:' : 'https:'
  const origin = `${protocol}//${host}`

  return initAuth0({
    clientId: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    scope,
    domain: process.env.AUTH0_DOMAIN,
    redirectUri: `${origin}/api/callback`,
    postLogoutRedirectUri: origin,
    session: {
      cookieSecret: process.env.SESSION_COOKIE_SECRET,
      cookieLifetime,
      storeIdToken: true
    },
    oidcClient: {
      httpTimeout
    }
  })
}
