// @flow

import renderer from 'react-test-renderer'
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
    const tree = renderer.create(<RemoveTrips {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
    expect(props['update']).not.toBeCalled()
  })
})
