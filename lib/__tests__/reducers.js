//

import {combineReducers} from 'redux'

import reducers from '../reducers'

describe('reducers > root', () => {
  it('should have default state', () => {
    const rootReducer = combineReducers(reducers)
    const state = rootReducer(undefined, {type: 'blah', payload: {}})

    // The default date is the current date, which makes testing a challenge
    state.analysis.profileRequest.date = '2016-12-20'
    expect(state).toMatchSnapshot()
  })
})
