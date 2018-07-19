// @flow
import _sortBy from 'lodash/sortBy'

import type {Action, State} from './types'

const initialState: State = {
  activeDataset: undefined,
  datasets: [],
  uploadStatuses: []
}

export default function reducer (state: State = initialState, action: Action): State {
  switch (action.type) {
    case 'opportunityDatasets/ADD':
      return {
        ...state,
        datasets: [...state.datasets, action.payload]
      }
    case 'opportunityDatasets/REMOVE':
      const datasetToRemove = action.payload
      return {
        ...state,
        datasets: state.datasets.filter((d) => d._id !== datasetToRemove._id)
      }
    case 'opportunityDatasets/SET_ACTIVE':
      return {
        ...state,
        activeDataset: action.payload
      }
    case 'opportunityDatasets/SET_ALL':
      return {
        ...state,
        datasets: _sortBy([...action.payload], ['sourceName', 'name'])
      }
    case 'opportunityDatasets/UPDATE':
      const dataset = action.payload
      return {
        ...state,
        datasets: state.datasets.map((d) =>
          d._id === dataset._id ? {...d, ...dataset} : d)
      }
    case 'opportunityDatasets/UPDATE_UPLOAD_STATUSES':
      return {
        ...state,
        uploadStatuses: action.payload // convert dates ?
      }
  }
  return state
}
