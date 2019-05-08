//
import enzyme from 'enzyme'
import React from 'react'

import RemoveTrips from '../remove-trips'
import {mockFeed, mockModification, mockPattern} from '../../../utils/mock-data'

describe('Component > Modification > RemoveTrips', () => {
  it('renders correctly', () => {
    const props = {
      feeds: [mockFeed],
      modification: mockModification,
      routePatterns: [mockPattern],
      selectedFeed: mockFeed,
      update: jest.fn(),
      updateAndRetrieveFeedData: jest.fn()
    }
    const tree = enzyme.shallow(<RemoveTrips {...props} />)
    expect(tree).toMatchSnapshot()
    expect(props['update']).not.toHaveBeenCalled()
    tree.unmount()
  })
})
