import {initAuth0} from '@auth0/nextjs-auth0'
import {parse} from 'cookie'
import {IncomingMessage} from 'http'
import ms from 'ms'

import {IUser} from './user'

const cookieLifetime = ms('30 days') / 1000
const httpTimeout = ms('10s')
const scope = 'openid profile id_token'

// Initialzed auth0s per origin served from this lambda
const auth0s = {}

function createAuth0(origin: string) {
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
        },
        idToken: 'fake'
      }),
      requireAuthentication: (fn) => fn
    }
  } else {
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
}

// Dyanmically create the Auth0 instance based upon a request
export default function initAuth0WithReq(req: IncomingMessage) {
  const host = req.headers.host
  const protocol = /^localhost(:\d+)?$/.test(host) ? 'http:' : 'https:'
  const origin = `${protocol}//${host}`
  if (auth0s[origin]) return auth0s[origin]
  auth0s[origin] = createAuth0(origin)
  return auth0s[origin]
}

/**
 * Flatten the session object and assign the accessGroup without the http portion.
 */
export async function getUser(req: IncomingMessage): Promise<IUser> {
  const auth0 = initAuth0WithReq(req)
  const session = await auth0.getSession(req)
  if (!session) {
    throw new Error('User session does not exist. User must be logged in.')
  }

  const user = {
    // This is a namespace for a custom claim. Not a URL: https://auth0.com/docs/tokens/guides/create-namespaced-custom-claims
    accessGroup: session.user['http://conveyal/accessGroup'],
    adminTempAccessGroup: null,
    email: session.user.name,
    idToken: session.idToken
  }

  if (user.accessGroup === process.env.NEXT_PUBLIC_ADMIN_ACCESS_GROUP) {
    const adminTempAccessGroup = parse(req.headers.cookie || '')
      .adminTempAccessGroup
    if (adminTempAccessGroup) user.adminTempAccessGroup = adminTempAccessGroup
  }

  return user
}

/**
 * Helper function for retrieving the access group.
 */
export async function getAccessGroup(req: IncomingMessage): Promise<string> {
  const user = await getUser(req)
  if (user.adminTempAccessGroup && user.adminTempAccessGroup.length > 0) {
    return user.adminTempAccessGroup
  }
  return user.accessGroup
}
