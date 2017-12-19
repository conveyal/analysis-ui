// @flow

import {handleActions} from 'redux-actions'

import * as mapState from '../map-state'

describe('reducers > Map State', () => {
  const reducer = handleActions(mapState.reducers, mapState.initialState)

  // Default State Test
  it('should handle default state', () => {
    expect(reducer(undefined, {type: 'blah', payload: {}})).toMatchSnapshot()
  })

  // Specific Handler Tests
  it('should handle add component to map', () => {
    const action = {type: 'add component to map', payload: 'mockComponent'}
    expect(reducer(undefined, action)).toMatchSnapshot()
  })

  it('should handle log out', () => {
    const action = {type: 'log out', payload: {}}
    const beginState = {components: ['mockComponent']}
    expect(reducer(beginState, action)).toMatchSnapshot()
  })

  it('should handle remove component from map', () => {
    const action = {type: 'remove component from map', payload: 'mockComponent'}
    const beginState = {components: ['mockComponent']}
    expect(reducer(beginState, action)).toMatchSnapshot()
  })

  it('should handle set active trips', () => {
    const action = {type: 'set active trips', payload: [1, 2, 3]}
    expect(reducer(undefined, action)).toMatchSnapshot()
  })

  it('should handle set isochrone', () => {
    const action = {type: 'set isochrone', payload: 'mockIsochrone'}
    expect(reducer(undefined, action)).toMatchSnapshot()
  })

  it('should handle set map center', () => {
    const action = {type: 'set map center', payload: 'mockCenter'}
    expect(reducer(undefined, action)).toMatchSnapshot()
  })

  it('should handle set map state', () => {
    const action = {type: 'set map state', payload: {zoom: 1234}}
    expect(reducer(undefined, action)).toMatchSnapshot()
  })
})
