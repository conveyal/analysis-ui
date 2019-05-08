//
import enzyme from 'enzyme'
import React from 'react'

import ImportShapefile from '../import-shapefile'

describe('Component > ImportShapefile', () => {
  it('renders correctly', () => {
    const props = {
      close: jest.fn(),
      createModifications: jest.fn(),
      variants: [],
      projectId: '1'
    }

    // mount component
    const shallowed = enzyme.shallow(<ImportShapefile {...props} />)
    expect(shallowed).toMatchSnapshot()
    const noCalls = ['close', 'createModifications']
    noCalls.forEach(fn => {
      expect(props[fn]).not.toHaveBeenCalled()
    })
  })
})
