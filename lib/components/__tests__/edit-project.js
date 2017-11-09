// @flow

import renderer from 'react-test-renderer'
import React from 'react'

import EditProject from '../edit-project'
import {releaseVersions, allVersions, mockProject} from '../../utils/mock-data'

describe('Component > EditProject', () => {
  it('renders correctly', () => {
    const props = {
      addComponentToMap: jest.fn(),
      project: mockProject,
      clearUncreatedProject: jest.fn(),
      fetch: jest.fn(),
      removeComponentFromMap: jest.fn(),
      save: jest.fn(),
      load: jest.fn(),
      create: jest.fn(),
      loadR5Versions: jest.fn(),
      deleteProject: jest.fn(),
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
