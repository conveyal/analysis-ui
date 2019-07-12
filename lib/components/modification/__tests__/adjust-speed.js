//
import enzyme from 'enzyme'
import React from 'react'

import {mockFeed, mockModification} from '../../../utils/mock-data'
import AdjustSpeed from '../adjust-speed'

describe('Component > Modification > AdjustSpeed', () => {
  it('renders correctly', () => {
    const props = {
      feeds: [mockFeed],
      modification: mockModification,
      routePatterns: [],
      selectedFeed: undefined,
      setMapState: jest.fn(),
      update: jest.fn(),
      updateAndRetrieveFeedData: jest.fn()
    }
    const tree = enzyme.shallow(<AdjustSpeed {...props} />)
    expect(tree).toMatchSnapshot()
    const noCalls = ['update', 'setMapState']
    noCalls.forEach(fn => {
      expect(props[fn]).not.toHaveBeenCalled()
    })
    tree.unmount()
  })
})
