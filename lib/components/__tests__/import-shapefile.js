// @flow
import React from 'react'

import ImportShapefile from '../import-shapefile'
import {mockWithProvider} from '../../utils/mock-data'

describe('Component > ImportShapefile', () => {
  it('renders correctly', () => {
    const props = {
      close: jest.fn(),
      createModifications: jest.fn(),
      variants: [],
      projectId: '1'
    }

    // mount component
    const {snapshot} = mockWithProvider(<ImportShapefile {...props} />)
    expect(snapshot()).toMatchSnapshot()
    const noCalls = ['close', 'createModifications']
    noCalls.forEach(fn => {
      expect(props[fn]).not.toHaveBeenCalled()
    })
  })
})
