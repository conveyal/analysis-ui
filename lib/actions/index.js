import {createAction} from 'redux-actions'

import getDataForModifications from './get-data-for-modifications'
import * as projectStore from '../project-store'
import * as modification from '../utils/modification'
import {decrementOutstandingRequests, incrementOutstandingRequests, lockUiWithError, serverAction} from './network'

/**
 * Delete Bundle
 */
const deleteBundleLocally = createAction('delete bundle')
const deleteBundleOnServer = (id) =>
  serverAction(`/api/bundle/${id}`, { method: 'delete' })
export const deleteBundle = (id) => [deleteBundleLocally(id), deleteBundleOnServer(id)]

export const login = createAction('log in')
export const logout = createAction('log out')

/**
 * Delete Modification
 */
const deleteModificationLocally = createAction('delete modification')
const deleteModificationOnServer = (id) =>
  serverAction(`/api/modification/${id}`, { method: 'delete' })
export const deleteModification = (id) => [deleteModificationLocally(id), deleteModificationOnServer(id)]

/**
 * Save Modification
 */
export const setActiveModification = createAction('set active modification')
const saveModificationLocally = createAction('update modification')
const saveModificationToServer = (m) =>
  serverAction(`/api/modification/${m.id}`, {
    body: JSON.stringify(modification.formatForServer(m)),
    method: 'put'
  })
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
