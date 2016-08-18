import Auth0Lock from 'auth0-lock'
import Auth0Client from 'auth0-js'
import {push} from 'react-router-redux'

import {setUser} from '../actions'

const localStorage = window.localStorage

const SESSION_TIMEOUT = 1000 * 60 * 30 // 30 minutes
const WARNING_TIMEOUT = 1000 * 60 * 25 // 25 minutes

export const authIsRequired = process.env.AUTH0_CLIENT_ID && process.env.AUTH0_DOMAIN
export const lock = authIsRequired
  ? new Auth0Lock(process.env.AUTH0_CLIENT_ID, process.env.AUTH0_DOMAIN, {
    auth: {
      params: {
        scope: 'openid analyst offline_access'
      },
      redirect: false
    },
    closeable: false
  })
  : null
const client = authIsRequired
  ? new Auth0Client({
    clientID: process.env.AUTH0_CLIENT_ID,
    domain: process.env.AUTH0_DOMAIN
  })
  : null

export function bootstrap (store) {
  setUserAndRefreshIdToken(store)

  lock.on('authenticated', (authResult) => {
    lock.getProfile(authResult.idToken, (error, profile) => {
      if (error) {
        store.dispatch(setUser(null))
        store.dispatch(push('/login'))
      } else {
        const user = {
          ...authResult,
          profile
        }
        localStorage.setItem('user', JSON.stringify(user))
        store.dispatch(setUser(user))
        store.dispatch(push('/'))
      }
    })
  })

  const logout = () => lock.logout({returnTo: `${window.location.origin}/login`})

  let clearLogoutTimeout = setLogoutTimeout({logout, time: SESSION_TIMEOUT, warningTime: WARNING_TIMEOUT})
  store.subscribe(() => {
    const {user} = store.getState()
    clearLogoutTimeout()
    if ((!user || !user.idToken) && window.location.pathname.indexOf('/login') === -1) {
      logout()
    } else {
      clearLogoutTimeout = setLogoutTimeout({logout, time: SESSION_TIMEOUT, warningTime: WARNING_TIMEOUT})
    }
  })
}

function setLogoutTimeout ({
  logout,
  time,
  warningTime
}) {
  const logoutTimeoutId = setTimeout(logout, time)
  const warningTimeoutId = setTimeout(function () {
    window.alert('Scenario Editor will automatically log out in 5 minutes without further action.')
  }, warningTime)
  function clear () {
    clearTimeout(logoutTimeoutId)
    clearTimeout(warningTimeoutId)
  }
  return clear
}

function setUserAndRefreshIdToken (store) {
  const userString = localStorage.getItem('user')
  const user = userString && JSON.parse(userString)
  if (user && user.refreshToken) {
    store.dispatch(setUser(user))
    if (process.env.NODE_ENV !== 'development') {
      client.refreshToken(user.refreshToken, function (err, delegationResult) {
        if (err) {
          store.dispatch(setUser(null))
          store.dispatch(push('/login'))
        } else {
          user.idToken = delegationResult.id_token
          store.dispatch(setUser({idToken: delegationResult.id_token}))
          localStorage.setItem('user', JSON.stringify(user))
        }
      })
    }
  } else {
    store.dispatch(push('/login'))
  }
}
