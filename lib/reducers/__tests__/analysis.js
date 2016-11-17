/* globals describe, expect, it */

import { handleActions } from 'redux-actions'

import * as analysis from '../analysis'

describe('reducers > analysis', () => {
  const reducer = handleActions(analysis.reducers, analysis.initialState)

  // Default State Test
  it('should handle default state', () => {
    expect(reducer(undefined, { type: 'blah', payload: {} })).toMatchSnapshot()
  })

  // Specific Handler Tests
  it('should handle clear isochrone results', () => {
    const action = { type: 'clear isochrone results', payload: {} }
    expect(reducer(undefined, action)).toMatchSnapshot()
  })

  it('should handle set isochrone cutoff', () => {
    const action = { type: 'set isochrone cutoff', payload: 123 }
    expect(reducer(undefined, action)).toMatchSnapshot()
  })

  it('should handle set isochrone fetch status', () => {
    const action = { type: 'set isochrone fetch status', payload: true }
    expect(reducer(undefined, action)).toMatchSnapshot()
  })

  it('should handle set isochrone latlng', () => {
    const action = { type: 'set isochrone latlng', payload: 123 }
    expect(reducer(undefined, action)).toMatchSnapshot()
  })

  it('should handle set isochrone results', () => {
    const action = { type: 'set isochrone results', payload: { isochrone: 123 } }
    expect(reducer(undefined, action)).toMatchSnapshot()
  })
})
