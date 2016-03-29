import fetch from 'isomorphic-fetch'
import store from '../store'

export default function authenticatedFetch (url, options = {}) {
  const headers = options.headers || {}
  const state = store.getState()
  if (state.sessionToken) {
    headers.Authorization = `bearer ${state.sessionToken}`
  }
  return fetch(url, Object.assign({}, options, {headers}))
}
