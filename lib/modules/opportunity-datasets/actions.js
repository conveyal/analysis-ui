// @flow
import fetch from '@conveyal/woonerf/fetch'
import omit from 'lodash/omit'
import {createGrid} from 'browsochrones'
import {push} from 'react-router-redux'

import selectCurrentRegionId from '../../selectors/current-region-id'
import {fetchSignedS3Url} from '../../utils/fetch-signed-s3-url'

import * as select from './selectors'
import type {
  Action,
  Dispatch,
  GetState,
  OpportunityDataset,
  PartialOpportunityDataset,
  ThunkAction,
  UploadStatus
} from './types'

const OPP_URL = `${process.env.API_URL}/opportunities`

export const addOpportunityDataset = (dataset: OpportunityDataset): Action => ({
  type: 'opportunityDatasets/ADD',
  payload: dataset
})

export const removeOpportunityDataset = (
  dataset: OpportunityDataset
): Action => ({
  type: 'opportunityDatasets/REMOVE',
  payload: dataset
})

export const updateOpportunityDataset = (
  dataset: PartialOpportunityDataset
): Action => ({
  type: 'opportunityDatasets/UPDATE',
  payload: dataset
})

export const setActiveOpportunityDataset = (datasetKey?: string): Action => ({
  type: 'opportunityDatasets/SET_ACTIVE',
  payload: datasetKey
})

export const setOpportunityDatasets = (
  datasets: OpportunityDataset[]
): Action => ({
  type: 'opportunityDatasets/SET_ALL',
  payload: datasets
})

export const updateUploadStatuses = (
  uploadStatuses: UploadStatus[]
): Action => ({
  type: 'opportunityDatasets/UPDATE_UPLOAD_STATUSES',
  payload: uploadStatuses
})

export const goTo = (key: string = '') => (
  dispatch: Dispatch,
  getState: GetState
) => {
  const state = getState()
  const url = select.opportunitiesUrl(state, {})
  dispatch(push(`${url}${key}`))
}

export const downloadLODES = () => (dispatch: Dispatch, getState: GetState) => {
  const state = getState()
  const regionId = selectCurrentRegionId(state, {})

  dispatch(
    fetch({
      options: {
        method: 'POST'
      },
      url: `${OPP_URL}/region/${regionId}/download`,
      next: res => checkUploadStatus()
    })
  )
}

export const loadOpportunityDatasets = () => (
  dispatch: Dispatch,
  getState: GetState
) => {
  const state = getState()
  const regionId = selectCurrentRegionId(state, {})
  dispatch(
    fetch({
      url: `${OPP_URL}/region/${regionId}`,
      next: res => setOpportunityDatasets(res.value)
    })
  )
}

export const editOpportunityDataset = (dataset: OpportunityDataset) =>
  fetch({
    url: `${OPP_URL}/${dataset._id}`,
    options: {
      body: omit(dataset, 'grid'),
      method: 'put'
    },
    next: response => updateOpportunityDataset(response.value)
  })

export const deleteOpportunityDataset = (
  dataset: OpportunityDataset
): ThunkAction => (dispatch: Dispatch, getState: GetState) => {
  const state = getState()
  const datasets = select.opportunityDatasets(state, {})
  const firstOtherDataset = datasets.filter(d => d._id !== dataset._id)[0]
  dispatch(
    fetch({
      url: `${OPP_URL}/${dataset._id}`,
      options: {
        method: 'delete'
      },
      next(response) {
        dispatch(removeOpportunityDataset(dataset))
        if (firstOtherDataset) {
          dispatch(loadOpportunityDataset(firstOtherDataset))
        } else {
          dispatch(setActiveOpportunityDataset())
        }
      }
    })
  )
}

export const downloadOpportunityDataset = (
  dataset: OpportunityDataset,
  format: string
): ThunkAction =>
  fetch({
    url: `${OPP_URL}/${dataset._id}/${format}?redirect=false`,
    next(res) {
      window.open(res.value.url)
    }
  })

export const loadOpportunityDataset = (dataset: PartialOpportunityDataset) => [
  // Set it before loading the next one so that it clears the grid.
  setActiveOpportunityDataset(dataset._id),
  fetchSignedS3Url({
    url: `${OPP_URL}/${dataset._id}`,
    next: res =>
      updateOpportunityDataset({
        ...dataset,
        grid: createGrid(res.value)
      })
  })
]

export const uploadOpportunityDataset = (body: FormData): ThunkAction => (
  dispatch: Dispatch,
  getState: GetState
) => {
  const state = getState()
  const regionId = selectCurrentRegionId(state, {})

  // Set the region id
  body.set('regionId', regionId)

  dispatch(
    fetch({
      url: OPP_URL,
      options: {
        body,
        method: 'post'
      },
      next: response => [checkUploadStatus(), goTo('/')]
    })
  )
}

export const checkUploadStatus = () => (
  dispatch: Dispatch,
  getState: GetState
) => {
  const state = getState()
  const regionId = selectCurrentRegionId(state, {})

  dispatch(
    fetch({
      url: `${OPP_URL}/region/${regionId}/status`,
      next: response => updateUploadStatuses(response.value)
    })
  )
}

export const clearStatus = (statusId: string) => (
  dispatch: Dispatch,
  getState: GetState
) => {
  const state = getState()
  const regionId = selectCurrentRegionId(state, {})

  dispatch(
    fetch({
      url: `${OPP_URL}/region/${regionId}/status/${statusId}`,
      options: {
        method: 'delete'
      },
      next: response => checkUploadStatus()
    })
  )
}

export const deleteSourceSet = (sourceId: string) =>
  fetch({
    url: `${OPP_URL}/source/${sourceId}`,
    options: {
      method: 'delete'
    },
    next: response => [
      setActiveOpportunityDataset(),
      response.value.map(removeOpportunityDataset)
    ]
  })
