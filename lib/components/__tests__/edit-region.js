// @flow
import renderer from 'react-test-renderer'
import React from 'react'
import mock from 'jest-mock'

import EditRegion from '../edit-region'
import {mockRegion} from '../../utils/mock-data'

const {describe, expect, it} = global
describe('Component > EditRegion', () => {
  it('renders correctly', () => {
    const props = {
      addComponentToMap: mock.fn(),
      region: mockRegion,
      clearUncreatedRegion: mock.fn(),
      fetch: mock.fn(),
      removeComponentFromMap: mock.fn(),
      save: mock.fn(),
      load: mock.fn(),
      create: mock.fn(),
      deleteRegion: mock.fn(),
      setLocally: mock.fn(),
      setCenter: mock.fn(),
      isEditing: true
    }

    // mount component
    const tree = renderer.create(<EditRegion {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
    expect(props['addComponentToMap']).toBeCalled()
    const noCalls = [
      'clearUncreatedRegion',
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
