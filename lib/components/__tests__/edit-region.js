// @flow
import enzyme from 'enzyme'
import React from 'react'

import EditRegion from '../edit-region'
import {mockRegion} from '../../utils/mock-data'

describe('Component > EditRegion', () => {
  it('renders correctly', () => {
    const props = {
      region: mockRegion,
      save: jest.fn(),
      load: jest.fn(),
      create: jest.fn(),
      deleteRegion: jest.fn(),
      setLocally: jest.fn(),
      setCenter: jest.fn()
    }

    // mount component
    const tree = enzyme.shallow(<EditRegion {...props} />)
    expect(tree).toMatchSnapshot()
    const noCalls = [
      'save',
      'load',
      'setLocally',
      'setCenter'
    ]
    noCalls.forEach(fn => {
      expect(props[fn]).not.toHaveBeenCalled()
    })
  })
})
