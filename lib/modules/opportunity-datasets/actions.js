// @flow
import fetch from '@conveyal/woonerf/fetch'
import {createGrid} from 'browsochrones'
import {push} from 'react-router-redux'

import {addComponent, removeComponent} from '../../actions/map'
import {OPPORTUNITY_COMPONENT} from '../../constants/map'
import selectCurrentRegionId from '../../selectors/current-region-id'

import {selectOpportunityDatasets, selectOpportunitiesUrl} from './selectors'

import type {
  Action,
  Dispatch,
  GetState,
  OpportunityDataset,
  ThunkAction,
  UploadStatus
} from './types'

export const addOpportunityDataset =
  (dataset: OpportunityDataset): Action => ({
    type: 'opportunityDatasets/ADD',
    payload: dataset
  })

export const removeOpportunityDataset =
  (dataset: OpportunityDataset): Action => ({
    type: 'opportunityDatasets/REMOVE',
    payload: dataset
  })

export const updateOpportunityDataset =
  (dataset: OpportunityDataset): Action => ({
    type: 'opportunityDatasets/UPDATE',
    payload: dataset
  })

export const setActiveOpportunityDataset =
  (datasetKey?: string): Action => ({
    type: 'opportunityDatasets/SET_ACTIVE',
    payload: datasetKey
  })

export const setOpportunityDatasets =
  (datasets: OpportunityDataset[]): Action => ({
    type: 'opportunityDatasets/SET_ALL',
    payload: datasets
  })

export const updateUploadStatuses =
  (uploadStatuses: UploadStatus[]): Action => ({
    type: 'opportunityDatasets/UPDATE_UPLOAD_STATUSES',
    payload: uploadStatuses
  })

export const addOpportunityComponent = () =>
  addComponent(OPPORTUNITY_COMPONENT)
export const removeOpportunityComponent = () =>
  removeComponent(OPPORTUNITY_COMPONENT)

export const createGoTo = (key: string = ''): () => ThunkAction => (): ThunkAction =>
  (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const url = selectOpportunitiesUrl(state, {})
    dispatch(push(`${url}${key}`))
  }

export const deleteOpportunityDataset =
  (dataset: OpportunityDataset): ThunkAction =>
    (dispatch: Dispatch, getState: GetState) => {
      const state = getState()
      const regionId = selectCurrentRegionId(state, {})
      const datasets = selectOpportunityDatasets(state, {})
      const firstOtherDataset = datasets.find((d) => d.key !== dataset.key)
      dispatch(fetch({
        url: `/api/opportunities/${regionId}/${dataset.key}`,
        options: {
          method: 'delete'
        },
        next (response) {
          dispatch(removeOpportunityDataset(dataset))
          if (firstOtherDataset) {
            dispatch(loadOpportunityDataset(firstOtherDataset))
          } else {
            dispatch(setActiveOpportunityDataset())
          }
        }
      }))
    }

export const downloadOpportunityDataset =
    (dataset: OpportunityDataset, format: string): ThunkAction =>
      (dispatch: Dispatch, getState: GetState) => {
        const state = getState()
        const projectId = selectCurrentProjectId(state, {})
        dispatch(fetch({
          url: `/api/opportunities/${projectId}/${dataset.key}/${format}?redirect=false`,
          next: (err, res) => {
            if (!err) {
              window.open(res.value.url)
            }
          }
        }))
      }

export const loadOpportunityDataset =
  (dataset: OpportunityDataset): ThunkAction =>
    (dispatch: Dispatch, getState: GetState) => {
      const state = getState()
      const regionId = selectCurrentRegionId(state, {})

      // Set it before loading the next one so that it clears the grid.
      dispatch(setActiveOpportunityDataset(dataset.key))
      dispatch(fetch({
        url: `/api/opportunities/${regionId}/${dataset.key}`,
        next: (res) =>
          updateOpportunityDataset({
            ...dataset,
            grid: createGrid(res.value)
          })
      }))
    }

export const uploadOpportunityDataset = (body: FormData): ThunkAction =>
  (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const regionId = selectCurrentRegionId(state, {})

    dispatch(fetch({
      url: `/api/opportunities/${regionId}`,
      options: {
        body,
        method: 'post'
      },
      next: (response) => [
        checkUploadStatus(),
        createGoTo('/')()
      ]
    }))
  }

export const checkUploadStatus = () =>
  (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const regionId = selectCurrentRegionId(state, {})

    dispatch(fetch({
      url: `/api/opportunities/${regionId}/status`,
      next: (response) => updateUploadStatuses(response.value)
    }))
  }

export const clearStatus = (statusId: string) =>
  (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const regionId = selectCurrentRegionId(state, {})

    dispatch(fetch({
      url: `/api/opportunities/${regionId}/status/${statusId}`,
      options: {
        method: 'delete'
      },
      next: (response) => checkUploadStatus()
    }))
  }
