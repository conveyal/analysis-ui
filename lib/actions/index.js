import {createAction} from 'redux-actions'

import {getForScenario as getModificationsForScenario} from './modifications'
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
