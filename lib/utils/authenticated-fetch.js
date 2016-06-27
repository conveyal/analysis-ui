import dbg from 'debug'
import fetch from 'isomorphic-fetch'
import store from '../store' // TODO: don't import store from anywhere but the root/bootstrap

const debug = dbg('scenario-editor:authenticated-fetch')

export default async function authenticatedFetch (url, options = {}) {
  const method = options.method || 'get'
  const baseurl = url.split('?')[0]
  debug(`${method} ${baseurl}`)
  const headers = options.headers || {}
  const state = store.getState()
  if (state.user && state.user.idToken) {
    headers.Authorization = `bearer ${state.user.idToken}`
  }
  try {
    const response = await fetch(url, Object.assign({}, options, {headers}))
    debug(`${method} ${baseurl} is ${response.status} ${response.statusText}`)
    return response
  } catch (error) {
    debug(`${method} ${baseurl} error ${error.message}`)
    throw error
  }
}

export function parseJSON (res) {
  if (res.ok) {
    return res.json()
  } else {
    window.alert(res.statusText)
    throw new Error(res.statusText)
  }
}
