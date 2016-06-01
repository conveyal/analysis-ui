import fetch from 'isomorphic-fetch'
import store from '../store' // TODO: don't import store from anywhere but the root/bootstrap

export default function authenticatedFetch (url, options = {}) {
  const headers = options.headers || {}
  const state = store.getState()
  if (state.user && state.user.id_token) {
    headers.Authorization = `bearer ${state.user.id_token}`
  }
  return fetch(url, Object.assign({}, options, {headers}))
}

export function parseJSON (res) {
  if (res.ok) {
    return res.json()
  } else {
    window.alert(res.statusText)
    throw new Error(res.statusText)
  }
}
