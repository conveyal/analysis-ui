// @flow
import message from '@conveyal/woonerf/message'
import get from 'lodash/get'

const CLIENT_ID = process.env.AUTH0_CLIENT_ID
const DOMAIN = process.env.AUTH0_DOMAIN

let LogRocket = {identify () {}}
if (process.env.LOGROCKET) {
  LogRocket = require('logrocket')
  LogRocket.init(process.env.LOGROCKET)
}

// If client & domain exist, then require authentication
export const authIsRequired: boolean = !!(CLIENT_ID && DOMAIN)

// Default Conveyal logo & color
const logo = 'https://d2f1n6ed3ipuic.cloudfront.net/conveyal-128x128.png'
const primaryColor = '#2389c9'

// The default Auth0 scope to request
const scope = 'openid email profile analyst offline_access'

// Default Auth0 response type
const responseType = 'code id_token token'

/**
 * Initialize in a function call so that the Auth0 lock code isn't executed
 * until needed. When Auth0 code is "required" it saves the origin. This is a
 * problem when a user goes to another part of the site (ex: `/regions/create`)
 * and we want to `checkSession` before allowing them to continue. Each "origin"
 * must be saved in the Auth0 Dashboard (which is impossible due to IDs). So
 * instead we redirect to `/login`, `checkSession`, and redirect back to the
 * original path given.
 */
function initializeLock () {
  const Auth0Lock = require('auth0-lock').default
  return new Auth0Lock(CLIENT_ID, DOMAIN, {
    auth: {
      params: {
        responseType,
        scope
      },
      redirect: false
    },
    allowSignUp: false,
    theme: {
      logo,
      primaryColor
    },
    closable: false,
    languageDictionary: {
      title: message('authentication.logIn')
    }
  })
}

/**
 * Initialize Auth0, check the user session, and prompt for a login if needed
 */
export function login (setUser: (any) => void) {
  const lock = initializeLock()

  function handleAuthResult (error, authResult) {
    if (error) {
      return lock.show({
        flashMessage: {
          type: 'error',
          text: error.error_description
        }
      })
    }
    if (!authResult) return lock.show()

    // Flatten the user object
    const user = {
      ...authResult,
      ...authResult.idTokenPayload // contains email, name, nickname, stored metadata
    }

    // Check for the access group and show error if it does not exist
    const accessGroup = get(user, 'analyst.group')
    if (typeof accessGroup !== 'string') {
      return lock.show({
        flashMessage: {
          type: 'error',
          text: `User ${user.email} does not have access to this application.`
        }
      })
    }

    // Log user activities
    LogRocket.identify(user.userId || user.user_id, {
      accessGroup,
      email: user.email
    })

    // AuthResult OK, pass result on. idTokenPayload
    setUser(user)
    lock.hide()
  }

  // Set the default handler for auth errors
  lock.on('authorization_error', handleAuthResult)
  lock.on('authenticated', (authResult) => handleAuthResult(null, authResult))
  lock.on('unrecoverable_error', handleAuthResult)

  // Check the session by default
  lock.checkSession({
    responseType,
    scope,
    timeout: '2000'
  }, handleAuthResult)
}

/**
 * Log out and reload the page.
 */
export function logout () {
  const lock = initializeLock()

  lock.logout({
    clientID: CLIENT_ID,
    returnTo: window.location.origin
  })
}
