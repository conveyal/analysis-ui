import {createAction} from 'redux-actions'

import {API} from 'lib/constants'

import fetchAction from './fetch'
import {loadProjects} from './project'
import {loadRequestsSettings} from './analysis/profile-request'

import {loadBundles} from './'

export const clear = createAction('clear current region')

export const create = (formData) =>
  fetchAction({
    url: API.Region,
    options: {
      body: formData,
      method: 'post'
    }
  })

export const save = (region) =>
  fetchAction({
    url: `${API.Region}/${region._id}`,
    options: {
      body: region,
      method: 'put'
    }
  })

export const deleteLocally = createAction('delete region')
export const deleteRegion = (_id) => (dispatch) => {
  dispatch(deleteLocally(_id))

  return dispatch(
    fetchAction({
      options: {
        method: 'delete'
      },
      url: `${API.Region}/${_id}`
    })
  )
}

export const loadRegion = (id) => async (dispatch) => {
  const res = await fetch(`/api/regions/${id}`)
  const region = await res.json()
  dispatch(setLocally(region))
  return region
}

/**
 * Fully load a region and it's associated resources.
 */
export const load = (id) => async (dispatch) => {
  const [region, bundles, projects] = await Promise.all([
    dispatch(loadRegion(id)),
    dispatch(loadBundles({regionId: id})),
    dispatch(loadProjects({regionId: id}))
  ])

  // Load and set profile request
  dispatch(loadRequestsSettings(id))

  return {bundles, projects, region}
}

export const loadAll = () => async (dispatch) => {
  const res = await fetch('/api/regions')
  const regions = await res.json()
  dispatch(setAll(regions))
  return regions
}

export const setAll = createAction('set all regions')
export const setLocally = createAction('set region')
