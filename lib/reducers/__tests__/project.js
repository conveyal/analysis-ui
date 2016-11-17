/* globals describe, expect, it */

import { handleActions } from 'redux-actions'

import * as project from '../project'

describe('reducers > project', () => {
  const reducer = handleActions(project.reducers, project.initialState)
  const mockProject = { id: 'a' }

  // Default State Test
  it('should handle default state', () => {
    expect(reducer(undefined, { type: 'blah', payload: {} })).toMatchSnapshot()
  })

  // Specific Handler Tests
  it('should handle delete project', () => {
    const action = { type: 'delete project', payload: 'a' }
    const beginState = { projectsById: { a: mockProject } }
    expect(reducer(beginState, action)).toMatchSnapshot()
  })

  it('should handle set all projects', () => {
    const action = { type: 'set all projects', payload: [mockProject] }
    expect(reducer(undefined, action)).toMatchSnapshot()
  })

  it('should handle set project', () => {
    const action = { type: 'set project', payload: mockProject }
    expect(reducer(undefined, action)).toMatchSnapshot()
  })
})
