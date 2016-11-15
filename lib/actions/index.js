import {createAction} from 'redux-actions'

import {serverAction} from './network'

// bundle
export const addBundle = createAction('add bundle')
export const deleteBundle = (id) => [deleteBundleLocally(id), deleteBundleOnServer(id)]
const deleteBundleLocally = createAction('delete bundle')
const deleteBundleOnServer = (id) =>
  serverAction({
    url: `/api/bundle/${id}`,
    options: {
      method: 'delete'
    }
  })
export const saveBundle = (bundle) => [setBundle(bundle), saveBundleToServer(bundle)]
const saveBundleToServer = (bundle) =>
  serverAction({
    url: `/api/bundle/${bundle.id}`,
    options: {
      method: 'put',
      body: JSON.stringify(bundle)
    }
  })
export const setBundle = createAction('set bundle')
export const setBundles = createAction('set bundles')

// feed
/** Update the data pulled in from the GTFS feed */
export const setFeeds = createAction('set feeds')

// login / logout
export const login = createAction('log in')
export const logout = createAction('log out')

// map state
export const setActiveTrips = createAction('set active trips')
export const setMapState = createAction('set map state')
export const setUser = createAction('set user')
