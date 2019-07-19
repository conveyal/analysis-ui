import Cookie from 'js-cookie'
import get from 'lodash/get'
import nextCookies from 'next-cookies'
import Router from 'next/router'

import {setUser} from 'lib/actions'
import {RouteTo} from 'lib/constants'
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

// Ignore auth on certain URLs
const ignoreAuth = p =>
  [RouteTo.login, RouteTo.logout, RouteTo.authCallback, '/status'].indexOf(p) >
  -1

// Handle auth
export async function isAuthenticated(ctx) {
  // If no auth is required
  if (!authIsRequired || ignoreAuth(ctx.pathname)) return true
  const now = new Date().getTime()
  // Check if a valid user is in the store
  let user = ctx.reduxStore.getState().user
  if (user && now < user.expiresAt) return true

  // Next check the cookie
  user = getUserFromCookie(nextCookies(ctx))
  // If there is a valid expire time, set or renew
  if (typeof user.expiresAt === 'number') {
    if (!process.browser || now < user.expiresAt) {
      ctx.reduxStore.dispatch(setUser(user))
      return true
    } else {
      const user = await renewSession()
      if (user) {
        ctx.reduxStore.dispatch(setUser(user))
        return true
      }
    }
  }

  // User is not logged in, redirect to login
  if (process.browser) {
    Router.push({
      pathname: '/login',
      query: {
        redirectTo: Router.route
      }
    })
  } else {
    ctx.res.writeHead(302, {
      Location: `/login?redirectTo=${ctx.asPath}`
    })
    ctx.res.end()
  }

  return false
}

/**
 * Import and initialize WebAuth.
 */
function getAuth0Client(origin) {
  if (!client) {
    return import('auth0-js').then(auth0 => {
      client = new auth0.WebAuth({
        clientID,
        domain,
        redirectUri: `${origin || window.location.origin}/callback`,
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
export function handleAuth0Callback() {
  return getAuth0Client().then(
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
  return getAuth0Client().then(client => {
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
  return getAuth0Client(origin).then(
    client =>
      new Promise((resolve, reject) => {
        client.checkSession({}, (err, authResult) => {
          if (resultIsValid(authResult)) {
            resolve(setSession(authResult))
          } else {
            reject(false)
          }
        })
      })
  )
}

// Remove all data and log out
export function logout() {
  return getAuth0Client().then(client => {
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
