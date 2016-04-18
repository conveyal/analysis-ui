import Auth0Lock from 'auth0-lock'
import {push} from 'react-router-redux'

import {setUser} from './actions'

export const authIsRequired = process.env.AUTH0_CLIENT_ID && process.env.AUTH0_DOMAIN && true

export function bootstrap (store) {
  const {user} = store.getState()
  if (authIsRequired) {
    if (user && user.refresh_token) {
      lock.getClient().refreshToken(user.refresh_token, function (err, delegationResult) {
        if (err) {
          store.dispatch(setUser(null))
          store.dispatch(push('/login'))
        } else {
          user.id_token = delegationResult.id_token
          store.dispatch(setUser(user))
        }
      })
    } else {
      store.dispatch(push('/login'))
    }

    store.subscribe(() => {
      const {user} = store.getState()
      if ((!user || !user.id_token) && window.location.pathname.indexOf('/login') === -1) {
        lock.logout({returnTo: `${window.location.origin}/login`})
      }
    })
  }

  return !authIsRequired || (user && user.id_token)
}

export const lock = new Auth0Lock(process.env.AUTH0_CLIENT_ID, process.env.AUTH0_DOMAIN)
