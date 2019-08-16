import Cookie from 'js-cookie'
import get from 'lodash/get'
import nextCookies from 'next-cookies'

import localStorage from 'lib/utils/local-storage'

let LogRocket = {identify() {}}
if (process.env.LOGROCKET && process.env.NODE_ENV === 'production') {
  LogRocket = require('logrocket')
  LogRocket.init(process.env.LOGROCKET)
}

// Key to use for cookie storage
const COOKIE_KEY = 'user'

// Scope to request from Auth0
const AUTH0_SCOPE = 'email analyst'

const clientID = process.env.AUTH0_CLIENT_ID
const domain = process.env.AUTH0_DOMAIN

// If client & domain exist, then require authentication
const authIsRequired = process.env.NODE_ENV !== 'test' && !!(clientID && domain)

// Check if auth result is valid
const resultIsValid = r => r && r.accessToken && r.idToken

// WebAuth client instance
export let client

// Safely parse user data from the cookie
function getUserFromCookie(cookie) {
  try {
    return JSON.parse(get(cookie, COOKIE_KEY, '{}'))
  } catch (e) {
    console.error(e)
    return {}
  }
}

function setUser(user) {
  return {
    type: 'set user',
    payload: user
  }
}

// Handle auth
export async function isAuthenticated(ctx) {
  const now = new Date().getTime()
  // Check if a valid user is in the store
  let user = ctx.store.getState().user
  if (!authIsRequired || (user && now < user.expiresAt)) return

  // Next check the cookie
  user = getUserFromCookie(nextCookies(ctx))
  // If there is no valid expire time, user is not logged in
  if (typeof user.expiresAt !== 'number') throw new Error('User not logged in')

  // On the server, set the user and continue
  if (!process.browser || now < user.expiresAt) {
    ctx.store.dispatch(setUser(user))
  } else {
    // Renew session will throw an error if it fails
    const user = await renewSession()
    ctx.store.dispatch(setUser(user))
  }
}

/**
 * Import and initialize WebAuth.
 */
async function getAuth0Client(origin) {
  if (client) return client
  const auth0 = await import('auth0-js')
  client = new auth0.WebAuth({
    clientID,
    domain,
    redirectUri: `${origin || window.location.origin}/callback`,
    responseType: 'code id_token token',
    scope: AUTH0_SCOPE
  })
  return client
}

/**
 * Called when redirected back from log in domain.
 */
export async function handleAuth0Callback() {
  const client = await getAuth0Client()
  return new Promise((resolve, reject) => {
    client.parseHash((err, authResult) => {
      if (err) return reject(err)
      if (!resultIsValid(authResult)) return reject('Auth result invalid')
      const user = createUserFromAuthResult(authResult)
      setSession(user)
      resolve(user)
    })
  })
}

/**
 * Kick off the Auth0 Login which redirects to the login domain.
 */
export function login() {
  return getAuth0Client().then(client => {
    client.authorize()
  })
}

function createUserFromAuthResult(authResult) {
  // Set the time that the Access Token will expire at
  const expiresAt = authResult.expiresIn * 1000 + new Date().getTime()

  // Get the email and accessGroup for LogRocket
  const payload = authResult.idTokenPayload
  const email = payload.email
  const accessGroup = get(payload, 'analyst.group')

  // Form the user data
  return {
    accessGroup,
    expiresAt,
    email,
    idToken: authResult.idToken
  }
}

/**
 * Store the user data in a cookie and set up a renewal interval.
 */
function setSession(user) {
  // Set with localStorage to work across all browser windows
  localStorage.setItem('isLoggedIn', 'true')

  // Initialize the LogRocket session
  LogRocket.identify(user.email, {accessGroup: user.accessGroup})

  // Store in cookie for server rendering
  Cookie.set(COOKIE_KEY, user, {expires: new Date(user.expiresAt)})
}

// Renew without needing to log in again
export async function renewSession() {
  const client = await getAuth0Client(origin)
  return new Promise((resolve, reject) => {
    client.checkSession({}, (err, authResult) => {
      if (err) return reject(err)
      if (!resultIsValid(authResult)) {
        return reject(new Error('Renew session result is invalid.'))
      }

      const user = createUserFromAuthResult(authResult)
      setSession(user)
      resolve(user)
    })
  })
}

// Remove all data and log out
export async function logout() {
  const client = await getAuth0Client()

  Cookie.remove(COOKIE_KEY)

  // Log out across all open windows
  localStorage.removeItem('isLoggedIn')

  // Log out with Auth0
  client.logout({
    clientID,
    returnTo: window.location.origin
  })
}
