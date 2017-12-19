// @flow

import {handleActions} from 'redux-actions'

import * as project from '../project'

describe('reducers > project', () => {
  const reducer = handleActions(project.reducers, project.initialState)
  const mockIdObject = {_id: '1'}
  const mockModification = {_id: '1', type: 'adjust-dwell-time'}

  // Default State Test
  it('should handle default state', () => {
    expect(reducer(undefined, {type: 'blah', payload: {}})).toMatchSnapshot()
  })

  // Specific Handler Tests
  it('should handle add bundle', () => {
    const action = {type: 'add bundle', payload: mockIdObject}
    expect(reducer(undefined, action)).toMatchSnapshot()
  })

  it('should handle add project', () => {
    const action = {type: 'add project', payload: mockIdObject}
    expect(reducer(undefined, action)).toMatchSnapshot()
  })

  it('should handle delete bundle', () => {
    const action = {type: 'delete bundle', payload: '1'}
    const beginState = {bundles: [mockIdObject]}
    expect(reducer(beginState, action)).toMatchSnapshot()
  })

  it('should handle delete modification', () => {
    const action = {type: 'delete modification', payload: '1'}
    const beginState = {modifications: [mockModification]}
    expect(reducer(beginState, action)).toMatchSnapshot()
  })

  it('should handle delete project', () => {
    const action = {type: 'delete project', payload: '1'}
    const beginState = {projectsById: {'1': mockIdObject}}
    expect(reducer(beginState, action)).toMatchSnapshot()
  })

  it('should handle log out', () => {
    expect(reducer(undefined, {type: 'log out', payload: {}})).toMatchSnapshot()
  })

  it('should handle set bundle', () => {
    const action = {type: 'set bundle', payload: '1'}
    const beginState = {
      bundles: [mockIdObject],
      currentProject: {}
    }
    expect(reducer(beginState, action)).toMatchSnapshot()
  })

  it('should handle set bundles', () => {
    const action = {type: 'set bundles', payload: [mockIdObject]}
    const beginState = {
      currentProject: {
        bundleId: '1'
      }
    }
    expect(reducer(beginState, action)).toMatchSnapshot()
  })

  it('should handle set feeds', () => {
    const action = {type: 'set feeds', payload: [mockIdObject]}
    expect(reducer(undefined, action)).toMatchSnapshot()
  })

  it('should handle set modification', () => {
    const action = {type: 'set modification', payload: mockModification}
    expect(reducer(undefined, action)).toMatchSnapshot()
  })

  it('should handle set modifications', () => {
    const action = {type: 'set modifications', payload: [mockModification]}
    expect(reducer(undefined, action)).toMatchSnapshot()
  })

  it('should handle set project', () => {
    const mockProject = {_id: '1', bundleId: '1'}
    const action = {type: 'set project', payload: mockProject}
    const beginState = {bundles: [mockIdObject]}
    expect(reducer(beginState, action)).toMatchSnapshot()
  })

  it('should handle set projects', () => {
    const action = {type: 'set projects', payload: [mockIdObject]}
    expect(reducer(undefined, action)).toMatchSnapshot()
  })

  it('should handle show variant', () => {
    const action = {type: 'show variant', payload: 1}
    const beginState = {
      modifications: [
        {
          _id: '1',
          variants: [],
          type: 'adjust-dwell-time'
        }
      ]
    }
    expect(reducer(beginState, action)).toMatchSnapshot()
  })
})
