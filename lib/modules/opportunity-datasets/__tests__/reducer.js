import * as actions from '../actions'
import reducer, {initialState} from '../reducer'

describe('OpportunityDatasets > Reducer', () => {
  it('should keep grid data during SET_ALL', () => {
    const od = {
      _id: '1',
      key: 'key',
      name: 'OD',
      regionId: 'regionId',
      sourceId: 'sourceId',
      sourceName: 'sourceName'
    }
    const grid = {
      contains: () => true,
      data: [],
      height: 0,
      min: 0,
      north: 0,
      west: 0,
      width: 0,
      zoom: 0
    }
    const ods = [od]

    let state = reducer(initialState, actions.setOpportunityDatasets(ods))
    expect(state.datasets).toHaveLength(1)
    state = reducer(
      state,
      actions.updateOpportunityDataset({
        _id: od._id,
        grid
      })
    )

    state = reducer(state, actions.setOpportunityDatasets(ods))
    expect(state.datasets[0].grid).toBe(grid)
  })
})
