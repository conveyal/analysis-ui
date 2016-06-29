import Auth0Lock from 'auth0-lock'
import {push} from 'react-router-redux'

import {setUser} from './actions'

const SESSION_TIMEOUT = 1000 * 60 * 30 // 30 minutes
const WARNING_TIMEOUT = 1000 * 60 * 25 // 25 minutes

export const authIsRequired = process.env.AUTH0_CLIENT_ID && process.env.AUTH0_DOMAIN && true
export const lock = new Auth0Lock(process.env.AUTH0_CLIENT_ID, process.env.AUTH0_DOMAIN)

export function bootstrap (store) {
  const {user} = store.getState()
  if (authIsRequired) {
    if (user && user.refreshToken) {
      if (process.env.NODE_ENV !== 'development') {
        lock.getClient().refreshToken(user.refreshToken, function (err, delegationResult) {
          if (err) {
            store.dispatch(setUser(null))
            store.dispatch(push('/login'))
          } else {
            user.idToken = delegationResult.id_token
            store.dispatch(setUser(user))
          }
        })
      }
    } else {
      store.dispatch(push('/login'))
    }

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

  return !authIsRequired || (user && user.idToken)
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
