// @flow
import fetch from '@conveyal/woonerf/fetch'
import {createGrid} from 'browsochrones'
import {push} from 'react-router-redux'

import {addComponent, removeComponent} from '../../actions/map'
import {OPPORTUNITY_COMPONENT} from '../../constants/map'
import selectCurrentProjectId from '../../selectors/current-project-id'

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
      const projectId = selectCurrentProjectId(state, {})
      const datasets = selectOpportunityDatasets(state, {})
      const firstOtherDataset = datasets.find((d) => d.key !== dataset.key)
      dispatch(fetch({
        url: `/api/opportunities/${projectId}/${dataset.key}`,
        options: {
          method: 'delete'
        },
        next (error, response) {
          if (!error) {
            dispatch(removeOpportunityDataset(dataset))
            if (firstOtherDataset) {
              dispatch(loadOpportunityDataset(firstOtherDataset))
            } else {
              dispatch(setActiveOpportunityDataset())
            }
          }
        }
      }))
    }

export const loadOpportunityDataset =
  (dataset: OpportunityDataset): ThunkAction =>
    (dispatch: Dispatch, getState: GetState) => {
      const state = getState()
      const projectId = selectCurrentProjectId(state, {})

      // Set it before loading the next one so that it clears the grid.
      dispatch(setActiveOpportunityDataset(dataset.key))
      dispatch(fetch({
        // Chrome 57 preserves headers when following redirects, in a departure
        // from previous versions this means the auth header from
        // authenticatedFetch is passed to S3, which causes S3 to fail. Instead we
        // request the URL from the server as JSON and then follow manually
        url: `/api/opportunities/${projectId}/${dataset.key}?redirect=false`,
        next: (err, res) => {
          if (!err) {
            return fetch({
              url: res.value.url,
              options: {
                headers: {
                  Authorization: null // overwrite default auth header
                }
              },
              next: (error, res) => {
                if (!error) {
                  return updateOpportunityDataset({
                    ...dataset,
                    grid: createGrid(res.value)
                  })
                }
              }
            })
          }
        }
      }))
    }

export const uploadOpportunityDataset = (body: FormData): ThunkAction =>
  (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const projectId = selectCurrentProjectId(state, {})

    dispatch(fetch({
      url: `/api/opportunities/${projectId}`,
      options: {
        body,
        method: 'post'
      },
      next (error, response) {
        if (!error) {
          dispatch(checkUploadStatus())
          dispatch(createGoTo('/')())
        }
      }
    }))
  }

export const checkUploadStatus = () =>
  (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const projectId = selectCurrentProjectId(state, {})

    dispatch(fetch({
      url: `/api/opportunities/${projectId}/status`,
      next (error, response) {
        if (!error) {
          dispatch(updateUploadStatuses(response.value))
        }
      }
    }))
  }

export const clearStatus = (statusId: string) =>
  (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const projectId = selectCurrentProjectId(state, {})

    dispatch(fetch({
      url: `/api/opportunities/${projectId}/status/${statusId}`,
      options: {
        method: 'delete'
      },
      next (error, response) {
        if (!error) {
          dispatch(checkUploadStatus())
        }
      }
    }))
  }
