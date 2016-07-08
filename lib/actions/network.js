import {createAction} from 'redux-actions'

import authenticatedFetch from '../utils/authenticated-fetch'
import messages from '../messages'

const REQUEST_TIMEOUT_MS = 5000 // if things take more than 5s to save we have a problem

/** Lock the whole UI when there is a network error */
export const lockUiWithError = createAction('lock ui with error')
/** increment the number of outstanding requests, so we can draw the "Saving . . . / All changes saved" indicator */
export const incrementOutstandingRequests = createAction('increment outstanding requests')
export const decrementOutstandingRequests = createAction('decrement outstanding requests')
export const deleteModificationFromStore = createAction('delete modification')

async function fetchAction (fn, timeout = REQUEST_TIMEOUT_MS) {
  let timeoutid
  try {
    timeoutid = setTimeout(() => {
      throw lockUiWithError({
        error: messages.network.timeout,
        detailMessage: messages.network.checkConnection
      })
    }, timeout)
    const res = await fn()
    clearTimeout(timeoutid)
    if (res.ok !== false) {
      return res
    } else {
      return lockUiWithError({
        error: messages.network.serverError,
        detailMessage: res.statusText
      })
    }
  } catch (e) {
    clearTimeout(timeoutid)
    if (e.payload) {
      return e
    } else {
      return lockUiWithError({
        error: messages.network.error,
        detailMessage: e.message
      })
    }
  }
}

export function serverAction (url, opts) {
  return [
    incrementOutstandingRequests(),
    fetchAction(authenticatedFetch(url, opts))
      .then((res) => {
        const actions = [decrementOutstandingRequests()]
        // If the response is an action the store can dispatch, add it
        if (res.payload ||
          Array.isArray(res) ||
          typeof res.then === 'function') {
          actions.push(res)
        }
        return actions
      })
  ]
}
