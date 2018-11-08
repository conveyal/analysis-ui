// @flow

import renderer from 'react-test-renderer'
import React from 'react'

import {REROUTE} from '../../../constants'
import Reroute from '../reroute'
import {mockFeed, mockModification, mockRoute} from '../../../utils/mock-data'

const mockRerouteModificaion = {
  ...mockModification,
  dwellTime: 0,
  routes: [mockRoute.route_id],
  segmentSpeeds: [],
  segments: [],
  type: REROUTE
}

describe('Component > Modification > Reroute', () => {
  it('renders correctly', () => {
    const props = {
      feeds: [mockFeed],
      mapState: { state: 'reroute' },
      modification: mockRerouteModificaion,
      qualifiedStops: [],
      routePatterns: [],
      allStops: [],
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
