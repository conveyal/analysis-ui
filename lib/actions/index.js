// @flow
import fetch from '@conveyal/woonerf/fetch'
import {push} from 'react-router-redux'
import {createAction} from 'redux-actions'

import type {Bundle} from '../types'

// cannot use createAction with Error objects as payload:
// https://github.com/acdlite/redux-actions/issues/194
// thus write an action creator from scratch
export const lockUiWithError = (error: any) => {
  if (error.error) {
    // already correctly formatted
    return {
      type: 'lock ui with error',
      payload: error,
      error: true
    }
  } else if (error.stack) {
    // return the stack trace as the detail
    return {
      type: 'lock ui with error',
      payload: {
        error: error.message,
        detailMessage: error.stack
      },
      error: true
    }
  } else {
    // coerce the object itself to a string
    return {
      type: 'lock ui with error',
      payload: {error},
      error: true
    }
  }
}
export const clearError = createAction('clear error')

// bundle
export const addBundle = createAction('add bundle')
export const deleteBundle = (_id: string) => [
  deleteBundleLocally(_id),
  deleteBundleOnServer(_id)
]
const deleteBundleLocally = createAction('delete bundle')
const deleteBundleOnServer = (_id) =>
  fetch({
    url: `/api/bundle/${_id}`,
    options: {
      method: 'delete'
    }
  })
export const saveBundle = (bundle: Bundle) => [
  setBundle(bundle),
  saveBundleToServer(bundle)
]
const saveBundleToServer = (bundle: Bundle) =>
  fetch({
    url: `/api/bundle/${bundle._id}`,
    options: {
      method: 'put',
      body: bundle
    },
    next: (response) => setBundle(response.value)
  })
export const setBundle = createAction('set bundle')
export const setBundles = createAction('set bundles')
export const loadBundle = (_id: string) =>
  fetch({
    url: `/api/bundle/${_id}`,
    next: (response) => setBundle(response.value)
  })

// feed
/** Update the data pulled in from the GTFS feed */
export const setFeeds = createAction('set feeds')

// login / logout
export const login = createAction('log in')
export const logout = () => [createAction('log out'), push('/')]
export const setActiveTrips = createAction('set active trips')
export const setUser = createAction('set user')
