/* global describe, expect, it, jest */

import React from 'react'
import {Map} from 'react-leaflet'
import renderer from 'react-test-renderer'

import {mockFeed, mockModification} from '../test-utils/mock-data'

describe('Scenario-Map > StopLayer', () => {
  const StopLayer = require('../../lib/scenario-map/stop-layer')

  it('renders correctly', () => {
    const props = {
      feed: mockFeed,
      modification: mockModification,
      nullIsWildcard: true,
      onSelect: jest.fn(),
      selectedColor: 'blue',
      unselectedColor: 'red'
    }

    // mount component
    const tree = renderer.create(
      <Map>
        <StopLayer
          {...props}
          />
      </Map>
    )
    expect(tree).toMatchSnapshot()

    // expect circleMarkers to be added to map by intercepting call to Leaflet
    // expect(Leaflet.circleMarker.mock.calls[0][0]).toMatchSnapshot()
    // expect(Leaflet.circleMarker.mock.calls[1][0]).toMatchSnapshot()
  })
})
