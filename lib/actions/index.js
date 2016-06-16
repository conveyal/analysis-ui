import {createAction} from 'redux-actions'

import getDataForModifications from './get-data-for-modifications'
import messages from '../messages'
import {getProject} from '../project-store'
import authenticatedFetch from '../utils/authenticated-fetch'

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
      throw lockUiWithError({
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
        detailMessage: e
      })
    }
  }
}

function serverAction (fn) {
  return [
    incrementOutstandingRequests(),
    fetchAction(fn)
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

/**
 * Delete Bundle
 */
const deleteBundleLocally = createAction('delete bundle')
const deleteBundleOnServer = (id) =>
  serverAction(() =>
    authenticatedFetch(`/api/bundle/${id}`, { method: 'delete' }))
export const deleteBundle = (id) => [deleteBundleLocally(id), deleteBundleOnServer(id)]

export const login = createAction('log in')
export const logout = createAction('log out')

/**
 * Delete Modification
 */
const deleteModificationLocally = createAction('delete modification')
const deleteModificationOnServer = (id) =>
  serverAction(() =>
    authenticatedFetch(`/api/modification/${id}`, { method: 'delete' }))
export const deleteModification = (id) => [deleteModificationLocally(id), deleteModificationOnServer(id)]

/**
 * Save Modification
 */
const saveModificationLocally = createAction('update modification')
const saveModificationToServer = (m) =>
  serverAction(() =>
    authenticatedFetch(`/api/modification/${m.id}`, { method: 'put', body: JSON.stringify(m) }))
export const replaceModification = (m) => [saveModificationLocally(m), saveModificationToServer(m)]

/**
 * Projects
 */
export const loadProject = (id) =>
  serverAction(() => {
    return getProject(id) // TODO Turn this into multi tiered actions also
      .then((project) => {
        return [
          setProject(project),
          getDataForModifications({ modifications: [...project.modifications.values()], bundleId: project.bundleId, forceCompleteUpdate: true })
        ]
      })
  })
export const loadProjects = createAction('load projects')
export const setProject = createAction('set project')

export const setBundle = createAction('set bundle')
/** update map state */
export const setMapState = createAction('set map state')
export const setUser = createAction('set user')
/** Update the data pulled in from the GTFS feed */
export const updateData = createAction('update data')
/** update available variants */
export const createVariant = createAction('create variant')
export const updateVariant = createAction('update variant')
export const updateVariants = createAction('update variants')
