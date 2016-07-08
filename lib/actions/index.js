import {createAction} from 'redux-actions'

import {getForScenario as getModificationsForScenario} from './modifications'
import * as modification from '../utils/modification'
import {serverAction} from './network'

/**
 * Delete Bundle
 */
const deleteBundleLocally = createAction('delete bundle')
const deleteBundleOnServer = (id) =>
  serverAction({
    url: `/api/bundle/${id}`,
    options: {
      method: 'delete'
    }
  })
export const deleteBundle = (id) => [deleteBundleLocally(id), deleteBundleOnServer(id)]

export const login = createAction('log in')
export const logout = createAction('log out')

/**
 * Delete Modification
 */
const deleteModificationLocally = createAction('delete modification')
const deleteModificationOnServer = (id) =>
  serverAction({
    url: `/api/modification/${id}`,
    options: {
      method: 'delete'
    }
  })
export const deleteModification = (id) => [deleteModificationLocally(id), deleteModificationOnServer(id)]

/**
 * Save Modification
 */
export const setActiveModification = createAction('set active modification')
const saveModificationLocally = createAction('update modification')
const saveModificationToServer = (m) =>
  serverAction({
    url: `/api/modification/${m.id}`,
    options: {
      body: JSON.stringify(modification.formatForServer(m)),
      method: 'put'
    }
  })
export const replaceModification = (m) => [setActiveModification(m), saveModificationLocally(m), saveModificationToServer(m)]

/**
 * Projects
 */
export const loadProject = (id) =>
  serverAction({
    url: `/api/scenario/${id}`,
    next: async (response) => {
      const project = await response.json()
      return [
        setProject(project),
        getModificationsForScenario({
          bundleId: project.bundleId,
          scenarioId: id
        })
      ]
    }
  })
export const loadAllProjects = () =>
  serverAction({
    url: '/api/scenario',
    next: async (response) => {
      const projects = await response.json()
      return setProjects(projects)
    }
  })
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
