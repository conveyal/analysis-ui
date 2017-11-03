// @flow
/* eslint-disable no-use-before-define */

import type {Grid} from '../../types'

export type OpportunityDataset = {
  dataSource: string,
  grid?: Grid,
  key: string,
  name: string
}

export type UploadStatus = {
  completedAt: string,
  completedFeatures: number,
  createdAt: string,
  id: string,
  message: string,
  name: string,
  status: 'DONE' | 'ERROR' | 'PROCESSING' | 'UPLOADING',
  totalFeatures: number,
  totalGrids: number,
  uploadedGrids: number
}

export type State = {
  +activeDataset: void | string,
  +datasets: OpportunityDataset[],
  +uploadStatuses: UploadStatus[]
}

export type Action =
  {type: 'opportunityDatasets/ADD', payload: OpportunityDataset}
| {type: 'opportunityDatasets/REMOVE', payload: OpportunityDataset}
| {type: 'opportunityDatasets/SET_ALL', payload: OpportunityDataset[]}
| {type: 'opportunityDatasets/SET_ACTIVE', payload: void | string}
| {type: 'opportunityDatasets/UPDATE', payload: OpportunityDataset}
| {type: 'opportunityDatasets/UPDATE_UPLOAD_STATUSES', payload: UploadStatus[]}

export type Actions =
  Action
| Array<Action>
| FetchAction
| PromiseAction
| ThunkAction

export type Dispatch = (action: Actions) => any

export type FetchAction = {
  type: 'fetch'
}

export type GetState = () => any

export type PromiseAction = Promise<Action>

export type ThunkAction = (dispatch: Dispatch, getState: () => GetState) => any
