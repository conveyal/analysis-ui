import {createAction} from 'redux-actions'

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

export const setBundles = createAction('set bundles')
export const addBundle = createAction('add bundle')
export const setBundle = createAction('set bundle')
export const saveBundle = (bundle) => [setBundle(bundle), saveBundleToServer(bundle)]
const saveBundleToServer = (bundle) =>
  serverAction({
    url: `/api/bundle/${bundle.id}`,
    options: {
      method: 'put',
      body: JSON.stringify(bundle)
    }
  })

export const login = createAction('log in')
export const logout = createAction('log out')

/** update map state */
export const setActiveTrips = createAction('set active trips')
export const setMapState = createAction('set map state')
export const setUser = createAction('set user')
/** Update the data pulled in from the GTFS feed */
export const setFeeds = createAction('set feeds')
