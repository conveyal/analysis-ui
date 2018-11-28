// @flow
import React from 'react'

import {
  MAP_STATE_SELECT_FROM_STOP,
  MAP_STATE_SELECT_TO_STOP,
  REROUTE
} from '../../../constants'
import Reroute from '../reroute'
import {
  mockFeed,
  mockModification,
  mockWithProvider,
  mockRoute
} from '../../../utils/mock-data'

const mockRerouteModification = {
  ...mockModification,
  dwellTime: 0,
  fromStop: '1',
  routes: [mockRoute.route_id],
  segmentSpeeds: [],
  segments: [],
  toStop: '2',
  type: REROUTE
}

describe('Component > Modification > Reroute', () => {
  it('renders correctly', () => {
    const props = {
      feeds: [mockFeed],
      mapState: { state: 'reroute' },
      modification: mockRerouteModification,
      qualifiedStops: [],
      routePatterns: [],
      selectedFeed: mockFeed,
      segmentDistances: [],
      setMapState: jest.fn(),
      stops: [],
      update: jest.fn(),
      updateAndRetrieveFeedData: jest.fn()
    }
    const mock = mockWithProvider(<Reroute {...props} />)
    expect(mock.snapshot()).toMatchSnapshot()

    mock.wrapper.find('a[title="Select from stop"]').simulate('click')
    expect(props.setMapState.mock.calls[0][0]).toEqual({
      allowExtend: false,
      extendFromEnd: true,
      state: MAP_STATE_SELECT_FROM_STOP
    })

    mock.wrapper.find('a[title="Select to stop"]').simulate('click')
    expect(props.setMapState.mock.calls[1][0]).toEqual({
      allowExtend: false,
      extendFromEnd: false,
      state: MAP_STATE_SELECT_TO_STOP
    })

    mock.wrapper.find('a[title="Clear from stop"]').simulate('click')
    expect(props.update.mock.calls[0][0]).toEqual({
      fromStop: null,
      toStop: mockRerouteModification.toStop,
      segments: []
    })

    mock.wrapper.find('a[title="Clear to stop"]').simulate('click')
    expect(props.update.mock.calls[1][0]).toEqual({
      fromStop: mockRerouteModification.fromStop,
      toStop: null,
      segments: []
    })
  })
})
