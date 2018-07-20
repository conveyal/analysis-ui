// @flow
import React from 'react'
import mock from 'jest-mock'

import EditRegion from '../edit-region'
import {mockRegion, mockWithProvider} from '../../utils/mock-data'

describe('Component > EditRegion', () => {
  it('renders correctly', () => {
    const props = {
      region: mockRegion,
      clearUncreatedRegion: mock.fn(),
      fetch: mock.fn(),
      save: mock.fn(),
      load: mock.fn(),
      create: mock.fn(),
      deleteRegion: mock.fn(),
      setLocally: mock.fn(),
      setCenter: mock.fn(),
      isEditing: true
    }

    // mount component
    const {snapshot} = mockWithProvider(<EditRegion {...props} />)
    expect(snapshot()).toMatchSnapshot()
    const noCalls = [
      'clearUncreatedRegion',
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
