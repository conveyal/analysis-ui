import {createAction} from 'redux-actions'
import authenticatedFetch from '../utils/authenticated-fetch'
import messages from '../messages'

const REQUEST_TIMEOUT_MS = 5000 // if things take more than 5s to save we have a problem

export const deleteBundle = createAction('delete bundle')
export const loadProjects = createAction('load projects')
export const login = createAction('log in')
export const logout = createAction('log out')

/** Lock the whole UI when there is a network error */
export const lockUiWithError = createAction('lock ui with error')

/** increment the number of outstanding requests, so we can draw the "Saving . . . / All changes saved" indicator */
export const incrementOutstandingRequests = createAction('increment outstanding requests')
export const decrementOutstandingRequests = createAction('decrement outstanding requests')

export const deleteModification = (mId) => [createAction('delete modification'), incrementOutstandingRequests(), deleteModificationOnServer(mId)]

export const deleteModificationOnServer = (modificationId) => {
  return new Promise((resolve, reject) => {
    // has this request been completed, either successfully or otherwise?
    let requestComplete = false
    authenticatedFetch(`/api/modification/${modificationId}`, {
      method: 'delete'
    }).then((res) => {
      if (res.status !== 200) {
        // uh oh
        requestComplete = true
        resolve(lockUiWithError({
          error: messages.network.serverError,
          detailMessage: res.statusText
        }))
      } else {
        // yay everything worked!
        requestComplete = true
        resolve(decrementOutstandingRequests())
      }
    }).catch((err) => {
      // network issue?
      requestComplete = true
      resolve(lockUiWithError({
        error: messages.network.error,
        detailMessage: err
      }))
    })

    // keep track of this request and time it out relatively quickly so the UI doesn't get
    // out of sync
    setTimeout(() => {
      if (!requestComplete) {
        resolve(lockUiWithError({
          message: messages.network.timeout,
          detailMessage: messages.network.checkConnection
        }))
      }
    }, REQUEST_TIMEOUT_MS)
  })
}

/** Save a modification to the server */
export const saveModification = (m) =>
  new Promise((resolve, reject) => {
    // has this request been completed, either successfully or otherwise?
    let requestComplete = false

    authenticatedFetch(`/api/modification/${m.id}`, {
      method: 'put',
      body: JSON.stringify(m)
    }).then((res) => {
      if (res.status !== 200) {
        // uh oh
        requestComplete = true
        resolve(lockUiWithError({
          error: messages.network.serverError,
          detailMessage: res.statusText
        }))
      } else {
        // yay everything worked!
        requestComplete = true
        resolve(decrementOutstandingRequests())
      }
    }).catch((err) => {
      // network issue?
      requestComplete = true
      resolve(lockUiWithError({
        error: messages.network.error,
        detailMessage: err
      }))
    })

    // keep track of this request and time it out relatively quickly so the UI doesn't get
    // out of sync
    setTimeout(() => {
      if (!requestComplete) {
        resolve(lockUiWithError({
          message: messages.network.timeout,
          detailMessage: messages.network.checkConnection
        }))
      }
    }, REQUEST_TIMEOUT_MS)
  })

/** update a modification in the UI */
export const updateModification = createAction('update modification')

/** compose all the network request actions together */
export const replaceModification = (m) => [updateModification(m), incrementOutstandingRequests(), saveModification(m)]

export const setBundle = createAction('set bundle')
/** update map state */
export const setMapState = createAction('set map state')
export const setProject = createAction('set project')
export const setUser = createAction('set user')
/** Update the data pulled in from the GTFS feed */
export const updateData = createAction('update data')
/** update available variants */
export const createVariant = createAction('create variant')
export const updateVariant = createAction('update variant')
export const updateVariants = createAction('update variants')
