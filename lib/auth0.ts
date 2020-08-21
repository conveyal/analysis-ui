import {initAuth0} from '@auth0/nextjs-auth0'
import ms from 'ms'

const cookieLifetime = ms('30 days') / 1000
const httpTimeout = ms('10s')
const scope = 'openid profile id_token'
const redirectUri = `https://${process.env.VERCEL_URL}`

function createAuth0() {
  if (process.env.NEXT_PUBLIC_AUTH_DISABLED === 'true') {
    return {
      handleCallback: async () => {},
      handleLogin: async () => {},
      handleLogout: async () => {},
      handleProfile: async () => {},
      getSession: () => ({
        user: {
          name: 'local',
          'http://conveyal/accessGroup': 'local'
        }
      }),
      requireAuthentication: (fn) => fn
    }
  } else {
    return initAuth0({
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
  }
}

export default createAuth0()
