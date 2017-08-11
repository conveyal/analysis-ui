/* global describe, it, expect, jest */

import {releaseVersions, allVersions} from '../../utils/mock-data'

describe('Component > EditProject', () => {
  const renderer = require('react-test-renderer')
  const React = require('react')
  const EditProject = require('../edit-project')

  it('renders correctly', () => {
    const props = {
      addComponentToMap: jest.fn(),
      bounds: {
        north: 1,
        east: 2,
        south: 3,
        west: 4
      },
      clearUncreatedProject: jest.fn(),
      indicators: [],
      description: 'A test scenario',
      fetch: jest.fn(),
      id: '1',
      name: 'Test Scenario',
      r5Version: 'v3.0.0',
      removeComponentFromMap: jest.fn(),
      save: jest.fn(),
      load: jest.fn(),
      setLocally: jest.fn(),
      setCenter: jest.fn(),
      isEditing: true,
      releaseVersions,
      allVersions
    }

    // mount component
    const tree = renderer.create(<EditProject {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
    expect(props['addComponentToMap']).toBeCalled()
    const noCalls = [
      'clearUncreatedProject',
      'removeComponentFromMap',
      'save',
      'load',
      'setLocally',
      'setCenter'
    ]
    noCalls.forEach(fn => {
      expect(props[fn]).not.toBeCalled()
    })
  })
})
