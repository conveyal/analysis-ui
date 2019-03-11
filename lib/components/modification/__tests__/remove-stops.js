// @flow

import renderer from 'react-test-renderer'
import React from 'react'

import RemoveStops from '../remove-stops'
import {mockFeed, mockModification, mockPattern} from '../../../utils/mock-data'

describe('Component > Modification > RemoveStops', () => {
  it('renders correctly', () => {
    const props = {
      feeds: [mockFeed],
      modification: mockModification,
      routePatterns: [mockPattern],
      routeStops: [],
      selectedFeed: mockFeed,
      selectedStops: [],
      setMapState: jest.fn(),
      update: jest.fn(),
      updateAndRetrieveFeedData: jest.fn()
    }
    const tree = renderer.create(<RemoveStops {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
    const noCalls = ['setMapState', 'update']
    noCalls.forEach(fn => {
      expect(props[fn]).not.toHaveBeenCalled()
    })
  })
})
