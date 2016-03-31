import fetch from 'isomorphic-fetch'
import store from '../store'

export default function authenticatedFetch (url, options = {}) {
  const headers = options.headers || {}
  const state = store.getState()
  if (state.user && state.user.id_token) {
    headers.Authorization = `bearer ${state.user.id_token}`
  }
  return fetch(url, Object.assign({}, options, {headers}))
}
