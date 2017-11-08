// @flow
import renderer from 'react-test-renderer'
import React from 'react'
import mock from 'jest-mock'

import EditProject from '../edit-project'
import {releaseVersions, allVersions, mockProject} from '../../utils/mock-data'

const {describe, expect, it} = global
describe('Component > EditProject', () => {
  it('renders correctly', () => {
    const props = {
      addComponentToMap: mock.fn(),
      project: mockProject,
      clearUncreatedProject: mock.fn(),
      fetch: mock.fn(),
      removeComponentFromMap: mock.fn(),
      save: mock.fn(),
      load: mock.fn(),
      create: mock.fn(),
      loadR5Versions: mock.fn(),
      deleteProject: mock.fn(),
      setLocally: mock.fn(),
      setCenter: mock.fn(),
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
