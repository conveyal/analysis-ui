import Auth0Lock from 'auth0-lock'
import Auth0Client from 'auth0-js'
import {push} from 'react-router-redux'

import {setUser} from '../actions'
import messages from './messages'

const localStorage = window.localStorage

export const authIsRequired = process.env.AUTH0_CLIENT_ID && process.env.AUTH0_DOMAIN

export const lock = authIsRequired
  ? new Auth0Lock(process.env.AUTH0_CLIENT_ID, process.env.AUTH0_DOMAIN, {
    auth: {
      params: {
        scope: 'openid analyst offline_access'
      },
      redirect: false
    },
    allowSignUp: false,
    theme: {
      logo: 'http://conveyal.com/img/logo-128x128.png',
      primaryColor: '#2389c9'
    },
    closeable: false,
    autoclose: true,
    languageDictionary: {
      title: messages.authentication.logIn
    }
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

  const logout = () => {
    localStorage.removeItem('user') // TODO anything else in local storage?
    lock.logout({returnTo: `${window.location.origin}/login`})
  }

  store.subscribe(() => {
    const {user} = store.getState()
    if ((!user || !user.idToken) && window.location.pathname.indexOf('/login') === -1) {
      logout()
    }
  })
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
