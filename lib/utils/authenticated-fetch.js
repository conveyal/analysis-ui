import dbg from 'debug'
import fetch from 'isomorphic-fetch'
import store from '../store' // TODO: don't import store from anywhere but the root/bootstrap

const debug = dbg('scenario-editor:authenticated-fetch')

export default async function authenticatedFetch (url, options = {}) {
  debug(`${options.method || 'get'} ${url.split('?')[0]}`)
  const headers = options.headers || {}
  const state = store.getState()
  if (state.user && state.user.id_token) {
    headers.Authorization = `bearer ${state.user.id_token}`
  }
  const response = await fetch(url, Object.assign({}, options, {headers}))
  debug(`${options.method || 'get'} ${url.split('?')[0]} is ${response.status} ${response.statusText}`)
  return response
}

export function parseJSON (res) {
  if (res.ok) {
    return res.json()
  } else {
    window.alert(res.statusText)
    throw new Error(res.statusText)
  }
}
