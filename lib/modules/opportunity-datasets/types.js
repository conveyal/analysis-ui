// @flow
/* eslint-disable no-use-before-define */

import type {Grid} from '../../types'

export type Action =
  {type: 'opportunityDatasets/ADD', payload: OpportunityDataset}
| {type: 'opportunityDatasets/REMOVE', payload: OpportunityDataset}
| {type: 'opportunityDatasets/SET_ALL', payload: OpportunityDataset[]}
| {type: 'opportunityDatasets/SET_ACTIVE', payload: void | string}
| {type: 'opportunityDatasets/UPDATE', payload: OpportunityDataset}

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

export type OpportunityDataset = {
  dataSource: string,
  grid?: Grid,
  key: string,
  name: string
}

export type PromiseAction = Promise<Action>

export type State = {
  activeDataset: void | string,
  datasets: OpportunityDataset[],
  uploading: boolean
}

export type ThunkAction = (dispatch: Dispatch, getState: () => GetState) => any
