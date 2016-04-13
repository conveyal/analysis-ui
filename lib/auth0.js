import Auth0Lock from 'auth0-lock'
import {push} from 'react-router-redux'

import {setUser} from './actions'

export const authIsRequired = process.env.AUTH0_CLIENT_ID && process.env.AUTH0_DOMAIN

export function bootstrap (store) {
  if (authIsRequired) {
    const {user} = store.getState()
    if (user && user.refresh_token) {
      lock.getClient().refreshToken(user.refresh_token, function (err, delegationResult) {
        if (err) {
          store.dispatch(setUser(null))
          store.dispatch(push('/login'))
        } else {
          user.id_token = delegationResult.id_token
          store.dispatch(setUser(user))
          store.dispatch(push('/'))
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
}

export const lock = new Auth0Lock(process.env.AUTH0_CLIENT_ID, process.env.AUTH0_DOMAIN)
