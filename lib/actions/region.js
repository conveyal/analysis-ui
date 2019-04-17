// @flow
import fetch from '@conveyal/woonerf/fetch'
import omit from 'lodash/omit'
import pick from 'lodash/pick'
import {createAction} from 'redux-actions'
import {push} from 'react-router-redux'

import timeout from '../utils/timeout'
import type {Bookmark, Region} from '../types'

import {setCenter as setMapCenter} from './map'
import {loadProjects} from './project'
import {loadProfileRequestSettings} from './analysis/profile-request'

import {loadBundles} from './'

const CHECK_STATUS_TIMEOUT = 10 * 1000
const REGION_URL = `${process.env.API_URL}/region`

function createFormData(region) {
  const formData = new window.FormData()
  formData.append(
    'region',
    JSON.stringify(pick(region, ['name', 'description', 'bounds']))
  )
  if (region.customOpenStreetMapData) {
    formData.append('customOpenStreetMapData', region.customOpenStreetMapData)
  }
  return formData
}

export const create = (region: Region & {customOpenStreetMapData?: File}) =>
  fetch({
    url: REGION_URL,
    options: {
      body: createFormData(region),
      method: 'post'
    },
    next: response => [
      checkLoadStatus(response.value),
      push(`/regions/${response.value._id}`)
    ]
  })

export const save = (region: Region) =>
  fetch({
    url: `${REGION_URL}/${region._id}`,
    options: {
      body: region,
      method: 'put'
    },
    next: response => [
      checkLoadStatus(response.value),
      push(`/regions/${region._id}`)
    ]
  })

export const deleteLocally = createAction('delete region')
export const deleteRegion = (_id: string) =>
  fetch({
    options: {
      method: 'delete'
    },
    url: `${REGION_URL}/${_id}`,
    next: () => [deleteLocally(_id), push('/')]
  })

export const load = (id: string, done?: Function) => (dispatch: Function) =>
  dispatch(
    fetch({
      url: `${REGION_URL}/${id}`,
      next(response) {
        const region = response.value

        // For legacy regions that were accidentally storing them in the region
        delete region.bundles
        delete region.projects
        dispatch([
          setLocally(region),
          loadBundles({regionId: id}),
          loadProjects({regionId: id}),
          setMapCenter([
            (region.bounds.west + region.bounds.east) / 2,
            (region.bounds.north + region.bounds.south) / 2
          ]),
          loadProfileRequestSettings(id)
        ])

        //
        done && done()
      }
    })
  )

function checkLoadStatus(region: Region) {
  if (region.statusCode === 'DONE') {
    return load(region._id)
  } else if (region.statusCode === 'ERROR') {
    return setLocally(region)
  } else {
    return [
      setLocally(region),
      timeout(CHECK_STATUS_TIMEOUT).then(() =>
        fetch({
          url: `${REGION_URL}/${region._id}`,
          next: response => checkLoadStatus(response.value)
        })
      )
    ]
  }
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
export const createBookmark = (bookmark: Bookmark) => [
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
