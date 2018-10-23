// @flow
import * as actions from '../actions'
import reducer from '../reducer'

describe('OpportunityDatasets > Reducer', () => {
  it('should keep grid data during SET_ALL', () => {
    const od = {
      _id: 1,
      name: 'OD'
    }
    const gridData = 'GRID_DATA'
    const ods = [od]

    let state = reducer({datasets: []}, actions.setOpportunityDatasets(ods))
    expect(state.datasets).toHaveLength(1)
    state = reducer(state, actions.updateOpportunityDataset({
      _id: od._id,
      grid: gridData
    }))

    state = reducer(state, actions.setOpportunityDatasets(ods))
    expect(state.datasets[0].grid).toEqual(gridData)
  })
})

