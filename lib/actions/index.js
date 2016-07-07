import {createAction} from 'redux-actions'

import getDataForModifications from './get-data-for-modifications'
import messages from '../messages'
import * as projectStore from '../project-store'
import authenticatedFetch from '../utils/authenticated-fetch'
import modification from '../utils/modification'

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
        detailMessage: e.message
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
export const setActiveModification = createAction('set active modification')
const saveModificationLocally = createAction('update modification')
const saveModificationToServer = (m) =>
  serverAction(() =>
    authenticatedFetch(`/api/modification/${m.id}`, {
      body: JSON.stringify(modification.formatForServer(m)),
      method: 'put'
    }))
export const replaceModification = (m) => [setActiveModification(m), saveModificationLocally(m), saveModificationToServer(m)]

/**
 * Projects
 */
export const loadProject = (id) => [ // TODO Turn this into multi tiered action using serverAction
  incrementOutstandingRequests(),
  projectStore.get(id)
    .then((project) => [
      decrementOutstandingRequests(),
      setProject(project),
      getDataForModifications({ modifications: project.modifications, bundleId: project.bundleId, forceCompleteUpdate: true })
    ])
    .catch((e) => [
      decrementOutstandingRequests(),
      lockUiWithError({
        closable: true,
        error: 'Project Not Found',
        detailMessage: e.message
      })
    ])
]
export const loadAllProjects = () => [
  incrementOutstandingRequests(),
  projectStore.getAll()
    .then((projects) => [
      decrementOutstandingRequests(),
      setProjects(projects)
    ])
    .catch((e) => [
      decrementOutstandingRequests(),
      lockUiWithError({
        closable: true,
        error: 'Unable to Load Projects',
        detailMessage: e.message
      })
    ])
]
export const setProject = createAction('set project')
export const setProjects = createAction('set projects')

export const setBundle = createAction('set bundle')
/** update map state */
export const setActiveTrips = createAction('set active trips')
export const setMapState = createAction('set map state')
export const setUser = createAction('set user')
/** Update the data pulled in from the GTFS feed */
export const setFeeds = createAction('set feeds')
export const setBundles = createAction('set bundles')
/** update available variants */
export const createVariant = createAction('create variant')
export const expandVariant = createAction('expand variant')
export const showVariant = createAction('show variant')
export const updateVariant = createAction('update variant')
export const updateVariants = createAction('update variants')
