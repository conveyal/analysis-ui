// @flow

import renderer from 'react-test-renderer'
import React from 'react'

import {mockFeed, mockModification, mockPattern, mockStops} from '../../../utils/mock-data'

import ConvertToFrequency from '../convert-to-frequency'

describe('Component > Modification > ConvertToFrequency', () => {
  it('renders correctly', () => {
    const props = {
      allPhaseFromTimetableStops: {},
      feeds: [mockFeed],
      fullyQualifiedRouteStops: mockStops,
      modification: mockModification,
      routePatterns: [mockPattern],
      routeStops: mockStops,
      projectTimetables: [],
      selectedFeed: null,
      setActiveTrips: jest.fn(),
      update: jest.fn(),
      updateAndRetrieveFeedData: jest.fn()
    }
    const tree = renderer.create(<ConvertToFrequency {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
    const noCalls = ['setActiveTrips', 'update']
    noCalls.forEach(fn => {
      expect(props[fn]).not.toBeCalled()
    })
  })
})
