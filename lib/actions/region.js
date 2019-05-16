import omit from 'lodash/omit'
import Router from 'next/router'
import {createAction} from 'redux-actions'

import {RouteTo} from '../constants'
import fetch from '../fetch-action'
import timeout from '../utils/timeout'

import {setCenter as setMapCenter} from './map'
import {loadProjects} from './project'
import {loadProfileRequestSettings} from './analysis/profile-request'

import {loadBundles} from './'

const CHECK_STATUS_TIMEOUT = 10 * 1000
const REGION_URL = `${process.env.API_URL}/region`

export const create = formData =>
  fetch({
    url: REGION_URL,
    options: {
      body: formData,
      method: 'post'
    },
    next: response => {
      Router.push({
        pathname: RouteTo.projects,
        query: {regionId: response.value._id}
      })

      return checkLoadStatus(response.value)
    }
  })

export const save = region =>
  fetch({
    url: `${REGION_URL}/${region._id}`,
    options: {
      body: region,
      method: 'put'
    },
    next: response => {
      Router.push({
        pathname: RouteTo.regionSettings,
        query: {regionId: region._id}
      })

      return checkLoadStatus(response.value)
    }
  })

export const deleteLocally = createAction('delete region')
export const deleteRegion = _id =>
  fetch({
    options: {
      method: 'delete'
    },
    url: `${REGION_URL}/${_id}`,
    next: () => deleteLocally(_id)
  })

export const loadRegion = id =>
  fetch({
    url: `${REGION_URL}/${id}`,
    next(res) {
      const region = res.value
      // For legacy regions that were accidentally storing them in the region
      delete region.bundles
      delete region.projects
      return setLocally(region)
    }
  })

/**
 * Fully load a region and it's associated resources.
 */
export const load = id => async dispatch => {
  const region = await dispatch(loadRegion(id))

  dispatch(
    setMapCenter([
      (region.bounds.west + region.bounds.east) / 2,
      (region.bounds.north + region.bounds.south) / 2
    ])
  )

  const bundles = await dispatch(loadBundles({regionId: id}))
  const projects = await dispatch(loadProjects({regionId: id}))
  const profileRequestSettings = await dispatch(loadProfileRequestSettings(id))

  return {bundles, profileRequestSettings, projects, region}
}

const checkLoadStatus = region => async dispatch => {
  if (region.statusCode === 'DONE') return dispatch(load(region._id))

  // Set locally
  dispatch(setLocally(region))
  if (region.statusCode === 'ERROR') return

  // Wait, then fetch and check again
  await timeout(CHECK_STATUS_TIMEOUT)

  return dispatch(
    fetch({
      url: `${REGION_URL}/${region._id}`,
      next: r => checkLoadStatus(r.value)
    })
  )
}

export const loadAll = () =>
  fetch({
    url: REGION_URL,
    next: response => setAll(response.value)
  })

export const setAll = createAction('set all regions')
export const setLocally = createAction('set region')
export const clearCurrentRegion = createAction('clear current region')

// Properties stored locally but not in a profile request on the backend
const omitIllegalBookmarkProps = pr =>
  omit(pr, ['comparisonProjectId', 'comparisonVariant'])

const createBookmarkLocally = createAction('create bookmark')
export const createBookmark = bookmark => [
  fetch({
    url: `${REGION_URL}/${bookmark.regionId}/bookmark`,
    options: {
      body: {
        ...bookmark,
        profileRequest: omitIllegalBookmarkProps(bookmark.profileRequest)
      },
      method: 'post'
    },
    next: response => createBookmarkLocally(response.value)
  })
]
