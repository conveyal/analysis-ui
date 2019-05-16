import get from 'lodash/get'
import Cookie from 'js-cookie'

import localStorage from 'lib/utils/local-storage'

let LogRocket = {identify() {}}
if (process.env.LOGROCKET) {
  LogRocket = require('logrocket')
  LogRocket.init(process.env.LOGROCKET)
}

// Key to use for cookie storage
export const COOKIE_KEY = 'user'

// Scope to request from Auth0
const AUTH0_SCOPE = 'email analyst'

const clientID = process.env.AUTH0_CLIENT_ID
const domain = process.env.AUTH0_DOMAIN

// If client & domain exist, then require authentication
export const authIsRequired =
  process.env.NODE_ENV !== 'test' && !!(clientID && domain)

// Check if auth result is valid
const resultIsValid = r => r && r.accessToken && r.idToken

// WebAuth client instance
export let client

// Check if the user is authenticated
export function isAuthenticated(expiresAt) {
  return new Date().getTime() < expiresAt
}

/**
 * Import and initialize WebAuth.
 */
function init() {
  if (!client) {
    return import('auth0-js').then(auth0 => {
      client = new auth0.WebAuth({
        clientID,
        domain,
        redirectUri: `${window.location.origin}/callback`,
        responseType: 'code id_token token',
        scope: AUTH0_SCOPE
      })
      return client
    })
  }
  return Promise.resolve(client)
}

/**
 * Called when redirected back from log in domain.
 */
export function handleAuthentication() {
  return init().then(
    client =>
      new Promise((resolve, reject) => {
        client.parseHash((err, authResult) => {
          if (resultIsValid(authResult)) {
            resolve(setSession(authResult))
          } else {
            console.error(err)
            reject(logout())
          }
        })
      })
  )
}

/**
 * Kick off the Auth0 Login which redirects to the login domain.
 */
export function login() {
  return init().then(client => {
    client.authorize()
  })
}

/**
 * Store the Auth0 data in a cookie and set up a renewal interval.
 */
function setSession(authResult) {
  // Set with localStorage to work across all browser windows
  localStorage.setItem('isLoggedIn', 'true')

  // Set the time that the Access Token will expire at
  const expiresAt = authResult.expiresIn * 1000 + new Date().getTime()
  const expires = new Date(expiresAt)

  // Get the email and accessGroup for LogRocket
  const payload = authResult.idTokenPayload
  const email = payload.email
  const accessGroup = get(payload, 'analyst.group')

  // Initialize the LogRocket session
  LogRocket.identify(email, {accessGroup})

  // Form the user data
  const user = {
    accessGroup,
    expiresAt,
    email: authResult.idTokenPayload.email,
    idToken: authResult.idToken
  }

  // Store in cookie for server rendering
  Cookie.set(COOKIE_KEY, user, {expires})

  // Return for the user store
  return user
}

// Renew without needing to log in again
export function renewSession() {
  return init().then(
    client =>
      new Promise((resolve, reject) => {
        client.checkSession({}, (err, authResult) => {
          if (resultIsValid(authResult)) {
            resolve(setSession(authResult))
          } else {
            reject(logout())
          }
        })
      })
  )
}

// Remove all data and log out
export function logout() {
  return init().then(client => {
    Cookie.remove(COOKIE_KEY)

    // Log out across all open windows
    localStorage.removeItem('isLoggedIn')

    // Log out with Auth0
    client.logout({
      clientID,
      returnTo: window.location.origin
    })
  })
}
