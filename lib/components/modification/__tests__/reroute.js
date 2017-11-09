// @flow

import renderer from 'react-test-renderer'
import React from 'react'

import Reroute from '../reroute'
import {mockFeed, mockModification} from '../../../utils/mock-data'

describe('Component > Modification > Reroute', () => {
  it('renders correctly', () => {
    const props = {
      feeds: [mockFeed],
      mapState: { state: 'reroute' },
      modification: mockModification,
      qualifiedStops: [],
      routePatterns: [],
      segmentDistances: [],
      setMapState: jest.fn(),
      stops: [],
      update: jest.fn(),
      updateAndRetrieveFeedData: jest.fn()
    }
    const tree = renderer.create(<Reroute {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
    const noCalls = ['setMapState', 'update']
    noCalls.forEach(fn => {
      expect(props[fn]).not.toBeCalled()
    })
  })
})
