// @flow

import {handleActions} from 'redux-actions'

import * as network from '../network'

describe('reducers > network', () => {
  const reducer = handleActions(network.reducers, network.initialState)

  // Default State Test
  it('should handle default state', () => {
    expect(reducer(undefined, {type: 'blah', payload: {}})).toMatchSnapshot()
  })

  // Specific Handler Tests
  it('should handle decrement outstanding requests', () => {
    const action = {type: 'decrement outstanding requests', payload: {}}
    expect(reducer(undefined, action)).toMatchSnapshot()
  })

  it('should handle increment outstanding requests', () => {
    const action = {type: 'increment outstanding requests', payload: {}}
    expect(reducer(undefined, action)).toMatchSnapshot()
  })

  it('should handle lock ui with error', () => {
    const action = {type: 'lock ui with error', payload: 'mockError'}
    expect(reducer(undefined, action)).toMatchSnapshot()
  })
})
